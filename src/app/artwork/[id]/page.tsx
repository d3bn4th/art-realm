import { artworks } from '@/app/data/artworks';
import { notFound } from 'next/navigation';
import ArtworkDetails from './ArtworkDetails';

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = artworks.find(art => art.id === parseInt(id));

  if (!artwork) {
    notFound();
  }

  // Find related artworks (same category or artist)
  const relatedArtworks = artworks.filter(art => 
    art.id !== artwork.id && 
    (art.category === artwork.category || art.artist === artwork.artist)
  ).slice(0, 3);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ArtworkDetails artwork={artwork} relatedArtworks={relatedArtworks} />
      </div>
    </div>
  );
} 