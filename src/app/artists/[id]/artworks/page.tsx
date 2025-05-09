'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import PriceDisplay from '@/components/ui/PriceDisplay';

interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  artist: {
    id: string;
    name: string;
    image: string | null;
  };
  isEcoFriendly: boolean;
}

interface ArtistInfo {
  id: string;
  name: string;
  image: string | null;
}

interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// Component that uses useSearchParams
function ArtworksList() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artist, setArtist] = useState<ArtistInfo | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
  });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Get filter values from URL params or defaults
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const isEcoFriendly = searchParams.get('isEcoFriendly') === 'true';

  // Update URL with filters
  const updateFilters = (filters: Record<string, string | number | boolean>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set page to 1 when filters change (except when explicitly changing page)
    if (!('page' in filters)) {
      params.set('page', '1');
    }
    
    // Update params based on provided filters
    Object.entries(filters).forEach(([key, value]) => {
      // Special handling for 'all' category value - remove the parameter
      if ((key === 'category' && value === 'all') || value === false || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    
    router.push(`/artists/${params.get('id')}/artworks?${params.toString()}`);
  };

  // Fetch artist and artworks data
  useEffect(() => {
    const fetchArtistArtworks = async () => {
      setLoading(true);
      try {
        // First get basic artist info
        const artistResponse = await fetch(`/api/artists/${params.id}`);
        if (!artistResponse.ok) throw new Error('Failed to fetch artist');
        const artistData = await artistResponse.json();
        setArtist({
          id: artistData.id,
          name: artistData.name,
          image: artistData.image,
        });
        
        // Then get artworks with pagination and filters
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '12',
          ...(category && { category }),
          ...(sortBy && { sortBy }),
          ...(isEcoFriendly && { isEcoFriendly: 'true' }),
        });
        
        const response = await fetch(`/api/artists/${params.id}/artworks?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch artworks');
        
        const data = await response.json();
        setArtworks(data.artworks);
        setPagination(data.pagination);
        setCategories(data.filters.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistArtworks();
  }, [params.id, page, category, sortBy, isEcoFriendly]);

  if (loading && !artist) {
    return (
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="h-10 bg-gray-800 rounded w-full mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href={`/artists/${params.id}`} className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Artist Profile
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {artist?.name}&apos;s Artworks
          </h1>
          <p className="text-gray-400 mt-2">Browse all artworks from this artist</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category || 'all'} 
                onValueChange={(value: string) => updateFilters({ category: value })}
              >
                <SelectTrigger id="category" className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <Select 
                value={sortBy} 
                onValueChange={(value: string) => updateFilters({ sortBy: value })}
              >
                <SelectTrigger id="sortBy" className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="eco-friendly" 
                  checked={isEcoFriendly}
                  onCheckedChange={(checked) => 
                    updateFilters({ isEcoFriendly: checked === true })
                  }
                  className="border-gray-700"
                />
                <Label 
                  htmlFor="eco-friendly"
                  className="text-sm text-gray-300"
                >
                  Eco-Friendly Only
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        {loading ? (
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        ) : artworks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <Card 
                  key={artwork.id} 
                  className="bg-gray-900 border-gray-800 overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <Link href={`/artwork/${artwork.id}`}>
                    <div className="relative h-48 w-full">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                      />
                      {artwork.isEcoFriendly && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          Eco-Friendly
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-white mb-1 line-clamp-1">
                        {artwork.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{artwork.category}</p>
                      <PriceDisplay price={artwork.price} variant="compact" size="sm" />
                    </div>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                    disabled={pagination.currentPage === 1}
                    onClick={() => updateFilters({ page: pagination.currentPage - 1 })}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Show only 5 page numbers centered around current page
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.currentPage === pageNum ? "default" : "outline"}
                            className={
                              pagination.currentPage === pageNum
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                            }
                            onClick={() => updateFilters({ page: pageNum })}
                          >
                            {pageNum}
                          </Button>
                        );
                      } else if (
                        (pageNum === pagination.currentPage - 2 && pagination.currentPage > 3) ||
                        (pageNum === pagination.currentPage + 2 && pagination.currentPage < pagination.totalPages - 2)
                      ) {
                        return <span key={pageNum} className="text-gray-500">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => updateFilters({ page: pagination.currentPage + 1 })}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-400">No artworks found</h3>
            <p className="text-gray-500 mt-2">Try changing your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ArtistArtworksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="h-10 bg-gray-800 rounded w-full mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ArtworksList />
    </Suspense>
  );
} 