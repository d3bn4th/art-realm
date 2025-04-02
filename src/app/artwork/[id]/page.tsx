'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import BuyButton from '@/app/components/BuyButton';
import PriceDisplay from '@/components/ui/PriceDisplay';
import ArtworkRating from '@/components/ArtworkRating';

// Replacing Skeleton with a simple div since it's not available
const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-gray-700 animate-pulse ${className}`}></div>
);

interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  materials: string[];
  isEcoFriendly: boolean;
  artistId: string;
  artist: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ArtworkDetailPage() {
  const params = useParams();
  const { id } = params;
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await fetch(`/api/artworks/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch artwork');
        }
        const data = await response.json();
        setArtwork(data);
      } catch (err) {
        console.error('Error fetching artwork:', err);
        setError('Failed to load artwork details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtwork();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square relative">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-4">Artwork Not Found</h1>
            <p className="text-gray-300">
              {error || "We couldn't find the artwork you're looking for."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Artwork Image */}
          <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg border border-gray-700">
            <Image 
              src={artwork.image} 
              alt={artwork.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              {artwork.title}
            </h1>

            <div>
              <p className="text-lg text-gray-300">by <span className="text-white font-medium">{artwork.artist.name}</span></p>
            </div>

            <PriceDisplay price={artwork.price} variant="inline" size="md" />

            {/* Artwork Rating Component */}
            <ArtworkRating artworkId={artwork.id} />

            <div className="space-y-2">
              <h2 className="text-xl font-medium text-white">About this artwork</h2>
              <p className="text-gray-300">{artwork.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-400">Category</h3>
                <p className="text-white">{artwork.category}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Eco-Friendly</h3>
                <p className="text-white">{artwork.isEcoFriendly ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-1">Materials</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.materials.map((material, index) => (
                  <span 
                    key={index}
                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <BuyButton 
                artwork={{
                  id: artwork.id,
                  title: artwork.title,
                  price: artwork.price,
                  image: artwork.image,
                  artistId: artwork.artistId,
                  artistName: artwork.artist.name,
                }}
                showQuantity
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 