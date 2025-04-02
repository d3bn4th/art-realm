'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { searchArtworks } from '../utils/search';
import { formatToRupees } from '@/utils/currency';

type Artwork = {
  id: number;
  title: string;
  artist: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

// Component that uses useSearchParams
function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Artwork[]>([]);

  useEffect(() => {
    const filteredArtworks = searchArtworks(query);
    setResults(filteredArtworks);
  }, [query]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 text-black">
          {query ? `Search Results for "${query}"` : 'All Artworks'}
        </h1>
        
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black text-lg">
              No artworks found matching your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((artwork) => (
              <div key={artwork.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-black">
                      <Link href={`/artwork/${artwork.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {artwork.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-black">{artwork.artist}</p>
                  </div>
                  <p className="text-sm font-medium text-black">{formatToRupees(artwork.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function SearchResultsClient() {
  return (
    <Suspense fallback={
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200"></div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="mt-1 h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
} 