'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, ChatBubbleBottomCenterIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

type Artist = {
  id: string;
  name: string;
  image: string | null;
};

type Like = {
  id: string;
  userId: string;
  artworkId: string;
  createdAt: Date;
};

type Rating = {
  id: string;
  value: number;
  userId: string;
  artworkId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Artwork = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  materials: string[];
  createdAt: Date;
  artist: Artist;
  likes: Like[];
  ratings: Rating[];
  likeCount: number;
  avgRating: number;
};

interface ArtworkFeedProps {
  artworks: Artwork[];
}

export default function ArtworkFeed({ artworks }: ArtworkFeedProps) {
  const { data: session } = useSession();
  const [likedArtworks, setLikedArtworks] = useState<Record<string, boolean>>({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  // Initialize liked state from props
  useEffect(() => {
    if (session?.user?.id && artworks) {
      const initialLikedState: Record<string, boolean> = {};
      artworks.forEach(artwork => {
        initialLikedState[artwork.id] = artwork.likes.some(
          like => like.userId === session.user.id
        );
      });
      setLikedArtworks(initialLikedState);
    }
  }, [session, artworks]);

  const toggleLike = async (artworkId: string) => {
    if (!session?.user) {
      toast.error('Please sign in to like artworks');
      return;
    }

    try {
      // Optimistic UI update
      setLikedArtworks(prev => ({
        ...prev,
        [artworkId]: !prev[artworkId]
      }));

      // Call API to update like status
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId }),
      });

      if (!response.ok) {
        // Revert if API call fails
        setLikedArtworks(prev => ({
          ...prev,
          [artworkId]: !prev[artworkId]
        }));
        throw new Error('Failed to update like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    }
  };

  const toggleDescription = (artworkId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [artworkId]: !prev[artworkId]
    }));
  };

  return (
    <div className="space-y-8">
      {artworks.map((artwork) => (
        <motion.div
          key={artwork.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Artist header */}
          <div className="flex items-center p-4">
            <Link href={`/artists/${artwork.artist.id}`} className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                {artwork.artist.image ? (
                  <Image
                    src={artwork.artist.image}
                    alt={artwork.artist.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {artwork.artist.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="font-medium text-gray-900">{artwork.artist.name}</span>
            </Link>
            <span className="ml-auto text-sm text-gray-500">
              {format(new Date(artwork.createdAt), 'MMM d, yyyy')}
            </span>
          </div>

          {/* Artwork image */}
          <Link href={`/artwork/${artwork.id}`}>
            <div className="relative aspect-square w-full">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>

          {/* Interaction buttons */}
          <div className="p-4">
            <div className="flex items-center mb-3">
              <button 
                onClick={() => toggleLike(artwork.id)}
                className="mr-4 focus:outline-none"
                aria-label={likedArtworks[artwork.id] ? "Unlike" : "Like"}
              >
                {likedArtworks[artwork.id] ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                )}
              </button>
              <Link href={`/artwork/${artwork.id}#comments`}>
                <ChatBubbleBottomCenterIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </Link>
              
              <div className="ml-auto flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(artwork.avgRating) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Likes count */}
            <p className="text-sm font-semibold mb-1">
              {artwork.likeCount} {artwork.likeCount === 1 ? 'like' : 'likes'}
            </p>

            {/* Title and description */}
            <div>
              <h3 className="font-semibold text-gray-900">{artwork.title}</h3>
              <p className="text-gray-700 text-sm mt-1">
                {expandedDescriptions[artwork.id] 
                  ? artwork.description 
                  : artwork.description.length > 150 
                    ? `${artwork.description.substring(0, 150)}...` 
                    : artwork.description}
              </p>
              {artwork.description.length > 150 && (
                <button 
                  onClick={() => toggleDescription(artwork.id)}
                  className="text-gray-500 text-sm mt-1 hover:text-gray-700"
                >
                  {expandedDescriptions[artwork.id] ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>

            {/* Price tag */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-gray-900 font-medium">${artwork.price.toFixed(2)}</span>
              <Link 
                href={`/artwork/${artwork.id}`}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                View Details
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 