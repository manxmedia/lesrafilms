import { NextResponse } from 'next/server';

function text(block:string, tag:string){const m=block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`,'i'));return m?m[1].replace(/<!\[CDATA\[|\]\]>/g,'').trim():''}
function parseFeed(xml:string){
 const entries=xml.split(/<entry>/i).slice(1).map(b=>b.split(/<\/entry>/i)[0]);
 return entries.map(b=>{const id=text(b,'yt:videoId');return {id,title:text(b,'title'),published:text(b,'published'),url:`https://www.youtube.com/watch?v=${id}`,thumbnail:id?`https://i.ytimg.com/vi/${id}/hqdefault.jpg`:''}}).filter(v=>v.id);
}

async function getAllWithApi(key:string){
 const channelUrl=`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=lesrafilms&key=${encodeURIComponent(key)}`;
 const channelRes=await fetch(channelUrl,{next:{revalidate:900}}); if(!channelRes.ok) throw new Error('YouTube channel lookup failed');
 const channel=await channelRes.json(); const uploads=channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads; if(!uploads) throw new Error('Uploads playlist not found');
 const videos:any[]=[]; let page='';
 do{
   const url=`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploads}&pageToken=${page}&key=${encodeURIComponent(key)}`;
   const r=await fetch(url,{next:{revalidate:900}}); if(!r.ok) throw new Error('YouTube playlist lookup failed');
   const data=await r.json();
   for(const item of data.items||[]){const id=item.contentDetails?.videoId||item.snippet?.resourceId?.videoId;if(id) videos.push({id,title:item.snippet?.title||'Lesra Films video',published:item.snippet?.publishedAt||'',url:`https://www.youtube.com/watch?v=${id}`,thumbnail:item.snippet?.thumbnails?.high?.url||`https://i.ytimg.com/vi/${id}/hqdefault.jpg`});}
   page=data.nextPageToken||'';
 }while(page);
 return videos;
}

export async function GET(){
 try{
  const key=process.env.YOUTUBE_API_KEY;
  if(key){const videos=await getAllWithApi(key);return NextResponse.json({videos,source:'youtube-data-api'});}
  const user=process.env.YOUTUBE_USER || 'lesrafilms';
  const res=await fetch(`https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(user)}`,{next:{revalidate:900},headers:{'User-Agent':'LesraFilmsWebsite/1.0'}});
  if(!res.ok) throw new Error(`YouTube feed returned ${res.status}`);
  const xml=await res.text();
  return NextResponse.json({videos:parseFeed(xml),source:'youtube-rss',note:'Add YOUTUBE_API_KEY to load the complete uploads library.'});
 }catch(error){
  return NextResponse.json({videos:[],source:'error',message:'YouTube videos could not be loaded right now.'},{status:200});
 }
}
