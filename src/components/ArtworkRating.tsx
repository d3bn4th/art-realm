'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import StarRating from '@/components/ui/StarRating';

interface ArtworkRatingProps {
  artworkId: string;
}

export default function ArtworkRating({ artworkId }: ArtworkRatingProps) {
  const { status } = useSession();
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the artwork's rating and user's rating if they've submitted one
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/artworks/${artworkId}/rating`);
        if (response.ok) {
          const data = await response.json();
          setAverageRating(data.averageRating);
          setTotalRatings(data.totalRatings);
          // Set user's rating if available
          if (data.userRating) {
            setUserRating(data.userRating);
          }
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [artworkId]);

  // When a user submits a rating
  const handleRatingChange = async (rating: number) => {
    if (status !== 'authenticated') {
      toast.error('Please sign in to rate this artwork');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/artworks/${artworkId}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserRating(rating);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
        toast.success('Rating submitted successfully!');
      } else {
        let errorMessage = 'Failed to submit rating';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            errorMessage = await response.text() || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center space-x-2">
        <div className="h-6 w-24 bg-gray-700 rounded"></div>
        <div className="h-6 w-16 bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Artwork Rating</h3>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex flex-col">
          <p className="text-sm text-gray-400 mb-2">Average Rating</p>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-yellow-400">{averageRating.toFixed(1)}</span>
            <span className="ml-2 text-sm text-gray-400">
              ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
            </span>
          </div>
        </div>
        
        <div className="sm:ml-auto mt-4 sm:mt-0 border-t sm:border-t-0 border-gray-700 pt-4 sm:pt-0 sm:border-l sm:pl-6">
          <p className="text-sm text-gray-400 mb-2">
            {userRating > 0 ? 'Your Rating' : 'Rate This Artwork'}
          </p>
          <StarRating
            rating={userRating}
            onChange={handleRatingChange}
            readonly={isSubmitting || status !== 'authenticated'}
            size="lg"
          />
          {status !== 'authenticated' && (
            <p className="text-xs text-gray-500 mt-2">Sign in to rate</p>
          )}
          {userRating > 0 && status === 'authenticated' && (
            <p className="text-xs text-gray-500 mt-2">Click stars to update your rating</p>
          )}
        </div>
      </div>
    </div>
  );
} 