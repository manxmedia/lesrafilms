import { NextResponse } from 'next/server';

const CHANNEL_ID = 'UCSZFumUXX7ewh2eT92E7f6A';

type Video = {
  id: string;
  title: string;
  published: string;
  url: string;
  thumbnail: string;
};

function text(block: string, tag: string) {
  const m = block.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
  );

  return m
    ? m[1]
        .replace(/<!\[CDATA\[|\]\]>/g, '')
        .trim()
    : '';
}

function parseFeed(xml: string): Video[] {
  const entries = xml
    .split(/<entry>/i)
    .slice(1)
    .map((b) => b.split(/<\/entry>/i)[0]);

  return entries
    .map((b) => {
      const id = text(b, 'yt:videoId');

      return {
        id,
        title: text(b, 'title'),
        published: text(b, 'published'),
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: id
          ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
          : '',
      };
    })
    .filter((v) => v.id);
}

async function getFromRSS(): Promise<Video[]> {
  const feedUrl =
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

  const response = await fetch(feedUrl, {
    next: { revalidate: 900 },
    headers: {
      'User-Agent': 'LesraFilmsWebsite/1.0',
      Accept: 'application/atom+xml, application/xml, text/xml',
    },
  });

  if (!response.ok) {
    throw new Error(
      `YouTube RSS returned HTTP ${response.status}`
    );
  }

  const xml = await response.text();

  const videos = parseFeed(xml);

  if (!videos.length) {
    throw new Error('YouTube RSS returned no videos');
  }

  return videos;
}

async function getAllWithApi(key: string): Promise<Video[]> {
  const channelUrl =
    `https://www.googleapis.com/youtube/v3/channels` +
    `?part=contentDetails` +
    `&id=${CHANNEL_ID}` +
    `&key=${encodeURIComponent(key)}`;

  const channelRes = await fetch(channelUrl, {
    next: { revalidate: 900 },
  });

  if (!channelRes.ok) {
    throw new Error(
      `YouTube channel lookup failed: ${channelRes.status}`
    );
  }

  const channel = await channelRes.json();

  const uploads =
    channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploads) {
    throw new Error('Lesra Films uploads playlist not found');
  }

  const videos: Video[] = [];
  let page = '';

  do {
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet,contentDetails` +
      `&maxResults=50` +
      `&playlistId=${uploads}` +
      (page ? `&pageToken=${encodeURIComponent(page)}` : '') +
      `&key=${encodeURIComponent(key)}`;

    const response = await fetch(url, {
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      throw new Error(
        `YouTube playlist lookup failed: ${response.status}`
      );
    }

    const data = await response.json();

    for (const item of data.items || []) {
      const id =
        item.contentDetails?.videoId ||
        item.snippet?.resourceId?.videoId;

      if (!id) continue;

      videos.push({
        id,
        title:
          item.snippet?.title ||
          'Lesra Films video',
        published:
          item.snippet?.publishedAt ||
          '',
        url:
          `https://www.youtube.com/watch?v=${id}`,
        thumbnail:
          item.snippet?.thumbnails?.maxres?.url ||
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      });
    }

    page = data.nextPageToken || '';
  } while (page);

  return videos;
}

export async function GET() {
  try {
    const key = process.env.YOUTUBE_API_KEY;

    /*
     * If YouTube Data API key exists,
     * use it to retrieve the complete uploads library.
     */
    if (key) {
      const videos = await getAllWithApi(key);

      return NextResponse.json({
        videos,
        source: 'youtube-data-api',
        channelId: CHANNEL_ID,
      });
    }

    /*
     * Otherwise use the official YouTube Atom feed.
     * This returns the latest channel uploads.
     */
    const videos = await getFromRSS();

    return NextResponse.json({
      videos,
      source: 'youtube-rss',
      channelId: CHANNEL_ID,
      note:
        'RSS provides the latest uploads. Add YOUTUBE_API_KEY for the complete library.',
    });

  } catch (error) {
    console.error('Lesra Films YouTube API error:', error);

    return NextResponse.json(
      {
        videos: [],
        source: 'error',
        channelId: CHANNEL_ID,
        message:
          'YouTube videos could not be loaded right now.',
      },
      { status: 200 }
    );
  }
}