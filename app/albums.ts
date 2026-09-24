import fs from 'fs';
import path from 'path';

export type Album = {
  slug: string;
  name: string;
  cover: string;
  images: string[];
};

const photosRoot = path.join(
  process.cwd(),
  'public',
  'projects',
  'photos'
);

const imageExtensions = /\.(jpg|jpeg|png|webp|gif)$/i;

export async function getAlbums(): Promise<Album[]> {
  if (!fs.existsSync(photosRoot)) {
    return [];
  }

  const folders = fs
    .readdirSync(photosRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  return folders
    .map((folder) => {
      const folderPath = path.join(photosRoot, folder.name);

      const files = fs
        .readdirSync(folderPath)
        .filter((file) => imageExtensions.test(file))
        .sort();

      const images = files.map(
        (file) =>
          `/projects/photos/${encodeURIComponent(folder.name)}/${encodeURIComponent(file)}`
      );

      return {
        slug: folder.name,
        name: folder.name
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, (letter) => letter.toUpperCase()),
        cover: images[0] || '/images/placeholder.jpg',
        images,
      };
    })
    .filter((album) => album.images.length > 0);
}