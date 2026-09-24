'use client';

import { useEffect, useState } from 'react';

type Props = {
  images: string[];
  albumName: string;
};

export default function GalleryLightbox({ images, albumName }: Props) {
  const [active, setActive] = useState<number | null>(null);

  const close = () => setActive(null);
  const previous = () => {
    if (active === null || images.length === 0) return;
    setActive((active - 1 + images.length) % images.length);
  };
  const next = () => {
    if (active === null || images.length === 0) return;
    setActive((active + 1) % images.length);
  };

  useEffect(() => {
    if (active === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') previous();
      if (event.key === 'ArrowRight') next();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active]);

  return (
    <>
      <div className="gallery-photo-grid">
        {images.map((src, index) => (
          <button
            type="button"
            className="gallery-photo-card"
            key={src}
            onClick={() => setActive(index)}
            aria-label={`View ${albumName} photograph ${index + 1}`}
          >
            <img src={src} alt={`${albumName} ${index + 1}`} />
            <span className="gallery-photo-hint">View photo</span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${albumName} photo viewer`}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button type="button" className="lightbox-close" onClick={close} aria-label="Close photo viewer">
            ×
          </button>

          <button type="button" className="lightbox-arrow lightbox-prev" onClick={previous} aria-label="Previous photo">
            ‹
          </button>

          <div className="lightbox-content">
            <img src={images[active]} alt={`${albumName} ${active + 1}`} />
            <div className="lightbox-caption">
              <span>{albumName}</span>
              <span>{active + 1} / {images.length}</span>
            </div>
          </div>

          <button type="button" className="lightbox-arrow lightbox-next" onClick={next} aria-label="Next photo">
            ›
          </button>
        </div>
      )}
    </>
  );
}
