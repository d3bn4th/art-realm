'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatToRupees } from '@/utils/currency';

interface Artist {
  id: number;
  name: string;
  bio: string;
  image: string;
  artworksCount: number;
  rating: number;
  joinDate: string;
  location: string;
  specialties: string[];
}

interface Artwork {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
}

export default function ArtistProfile({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockArtist: Artist = {
          id: parseInt(params.id),
          name: 'Jane Artist',
          bio: 'Professional artist with 10 years of experience in oil painting and digital art. Specializing in contemporary abstract art and landscape paintings.',
          image: '/images/artists/jane.jpg',
          artworksCount: 15,
          rating: 4.8,
          joinDate: '2023-01-15',
          location: 'New York, USA',
          specialties: ['Oil Painting', 'Digital Art', 'Abstract Art'],
        };

        const mockArtworks: Artwork[] = [
          {
            id: 1,
            title: 'Abstract Dreams',
            image: '/images/artworks/abstract1.jpg',
            price: 599.99,
            category: 'Abstract',
          },
          {
            id: 2,
            title: 'City Lights',
            image: '/images/artworks/cityscape1.jpg',
            price: 799.99,
            category: 'Cityscape',
          },
          {
            id: 3,
            title: 'Nature\'s Beauty',
            image: '/images/artworks/landscape1.jpg',
            price: 699.99,
            category: 'Landscape',
          },
        ];

        setArtist(mockArtist);
        setArtworks(mockArtworks);
      } catch (error) {
        console.error('Error fetching artist data:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading artist profile...</div>
      </div>
    );
  }

  if (!artist) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Artist Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-64 w-full">
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{artist.name}</h1>
                <p className="mt-2 text-gray-600">{artist.location}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.934l-6.18 3.246 1.18-6.872L.11 7.574l6.9-1.002L10 .342l2.99 6.23 6.9 1.002-4.89 4.734 1.18 6.872z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 text-lg text-gray-900">{artist.rating}</span>
                </div>
                <p className="text-sm text-gray-500">Member since {new Date(artist.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-600">{artist.bio}</p>
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Specialties</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {artist.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Artist's Artworks */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Artworks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/artwork/${artwork.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-64 w-full">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{artwork.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{artwork.category}</p>
                    <p className="mt-2 text-lg font-medium text-gray-900">{formatToRupees(artwork.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 