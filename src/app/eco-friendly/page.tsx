'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { formatToRupees } from '@/utils/currency';

interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  materials: string[];
  artist: {
    name: string;
    id: string;
  };
}

export default function EcoFriendlyPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEcoArtworks = async () => {
      try {
        const response = await fetch('/api/artworks/eco-friendly');
        if (!response.ok) {
          throw new Error('Failed to fetch eco-friendly artworks');
        }
        const data = await response.json();
        setArtworks(data);
      } catch (error) {
        console.error('Error fetching eco-friendly artworks:', error);
        setError('Failed to load artworks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEcoArtworks();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading eco-friendly artworks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <SparklesIcon className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Eco-Friendly Art
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Discover sustainable artworks created with eco-friendly materials and practices.
              Supporting artists who are committed to environmental consciousness.
            </p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Makes Art Eco-Friendly?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sustainable Materials</h3>
              <p className="text-gray-600">
                Artworks created using recycled, biodegradable, or sustainably sourced materials
                that minimize environmental impact.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Eco-Conscious Process</h3>
              <p className="text-gray-600">
                Artists who employ environmentally friendly techniques and processes in their
                creation, reducing waste and energy consumption.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Environmental Message</h3>
              <p className="text-gray-600">
                Art that raises awareness about environmental issues and promotes sustainability
                through its message and presentation.
              </p>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {artwork.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  By{' '}
                  <Link
                    href={`/artists/${artwork.artist.id}`}
                    className="text-green-600 hover:text-green-700"
                  >
                    {artwork.artist.name}
                  </Link>
                </p>
                <p className="text-gray-600 mb-4 line-clamp-2">{artwork.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Materials:</h4>
                  <div className="flex flex-wrap gap-2">
                    {artwork.materials.map((material, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatToRupees(artwork.price)}
                  </span>
                  <Link
                    href={`/artwork/${artwork.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 