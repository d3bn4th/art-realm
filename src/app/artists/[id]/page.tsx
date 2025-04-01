'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import PriceDisplay from '@/components/ui/PriceDisplay';

interface ArtistProfile {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  location: string | null;
  specialties: string[];
  image: string | null;
  artworks: Array<{
    id: string;
    title: string;
    image: string;
    price: number;
  }>;
}

export default function ArtistProfilePage() {
  const params = useParams();
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await fetch(`/api/artists/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch artist data');
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-800 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
          <p className="text-gray-400">The artist you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-900 border-gray-800 p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="relative w-48 h-48 mx-auto md:mx-0">
                <Image
                  src={artist.image || '/images/default-avatar.jpg'}
                  alt={artist.name}
                  fill
                  className="rounded-full object-cover border-4 border-gray-700"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {artist.name}
              </h1>
              {artist.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {artist.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}
              {artist.location && (
                <p className="text-gray-400 mb-4">
                  <span className="font-medium">Location:</span> {artist.location}
                </p>
              )}
              {artist.bio && (
                <p className="text-gray-300 leading-relaxed">{artist.bio}</p>
              )}
            </div>
          </div>
        </Card>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Artworks by {artist.name}
            </h2>
            {artist.artworks.length > 0 && (
              <Link 
                href={`/artists/${params.id}/artworks`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                View All Artworks
              </Link>
            )}
          </div>
          {artist.artworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {artist.artworks.map((artwork) => (
                <Link href={`/artwork/${artwork.id}`} key={artwork.id}>
                  <Card className="group bg-gray-900 border-gray-800 overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-white mb-2">
                        {artwork.title}
                      </h3>
                      <PriceDisplay price={artwork.price} variant="compact" size="sm" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">
              No artworks available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 