'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Artist {
  id: string;
  name: string;
  bio: string;
  specialties: string[];
  location: string;
  image: string | null;
  _count: {
    artworks: number;
  };
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('/api/artists');
        if (!response.ok) {
          throw new Error('Failed to fetch artists');
        }
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setError('Failed to load artists. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-gray-300">Loading artists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent sm:text-4xl">
            Featured Artists
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-300 sm:mt-4">
            Discover talented artists from around the world showcasing their unique creations.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-gray-800 text-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700"
            >
              <div className="relative h-48 w-full overflow-hidden">
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <span className="text-5xl font-bold text-gray-500">{artist.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white">{artist.name}</h2>
                <p className="mt-2 text-sm text-gray-400">{artist.location}</p>
                <p className="mt-2 text-gray-300 line-clamp-3">{artist.bio}</p>
                
                {artist.specialties.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-200">Specialties:</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {artist.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-200"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {artist._count.artworks} {artist._count.artworks === 1 ? 'artwork' : 'artworks'}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={`/artists/${artist.id}`}
                    className="text-center bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                  >
                    View Profile
                  </Link>
                  
                  {artist._count.artworks > 0 && (
                    <Link
                      href={`/artists/${artist.id}/artworks`}
                      className="text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                    >
                      View Artworks
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 