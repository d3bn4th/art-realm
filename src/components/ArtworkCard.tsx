'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/ui/StarRating';
import { formatToRupees } from '@/utils/currency';

interface ArtworkCardProps {
  artwork: {
    id: string;
    title: string;
    price: number;
    image: string;
    category?: string;
    isEcoFriendly?: boolean;
    artist?: {
      id: string;
      name: string;
      image?: string | null;
    };
  };
  showRating?: boolean;
  showArtist?: boolean;
  className?: string;
}

export default function ArtworkCard({ 
  artwork, 
  showRating = true,
  showArtist = true,
  className = ''
}: ArtworkCardProps) {
  const [rating, setRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (showRating) {
      const fetchRating = async () => {
        try {
          const response = await fetch(`/api/artworks/${artwork.id}/rating`);
          if (response.ok) {
            const data = await response.json();
            setRating(data.averageRating);
            setTotalRatings(data.totalRatings);
          }
        } catch (error) {
          console.error('Error fetching rating:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRating();
    } else {
      setIsLoading(false);
    }
  }, [artwork.id, showRating]);

  return (
    <div className={`group bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:border-gray-700 ${className}`}>
      <Link href={`/artwork/${artwork.id}`} className="block">
        <div className="relative aspect-square">
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {artwork.isEcoFriendly && (
            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              Eco
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-medium text-lg truncate">
            {artwork.title}
          </h3>
          
          {showArtist && artwork.artist && (
            <p className="text-gray-400 text-sm mb-2">by {artwork.artist.name}</p>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-white font-bold">{formatToRupees(artwork.price)}</p>
            
            {showRating && !isLoading && rating > 0 && (
              <div className="flex items-center">
                <StarRating rating={rating} size="sm" readonly showValue />
                <span className="text-gray-400 text-xs ml-1">({totalRatings})</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
} 