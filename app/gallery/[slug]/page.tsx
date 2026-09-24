import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAlbums } from '@/app/albums';
import GalleryLightbox from '@/components/GalleryLightbox';

export const dynamic = 'force-dynamic';

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const albums = await getAlbums();
  const album = albums.find((item) => item.slug === slug);

  if (!album) notFound();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <Link href="/gallery" className="eyebrow">← Back to gallery</Link>
          <h1>{album.name}</h1>
          <p>{album.images.length} photographs from this Lesra Films project. Click any photograph to open the viewer, then use the arrows to move through the album.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <GalleryLightbox images={album.images} albumName={album.name} />
        </div>
      </section>
    </main>
  );
}
