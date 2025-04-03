import { Metadata } from 'next';
import ArtworkFeed from '@/app/components/ArtworkFeed';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Art Realm - Social Feed',
  description: 'Discover new artists and their artwork in a social media style feed',
};

async function getArtworksWithArtistsAndLikes() {
  try {
    // Fetch artworks with their artists and related likes and ratings
    const artworks = await prisma.artwork.findMany({
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        likes: true,
        ratings: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Process artworks to include statistics
    const processedArtworks = artworks.map(artwork => {
      // Calculate like count
      const likeCount = artwork.likes.length;
      
      // Calculate average rating
      let avgRating = 0;
      if (artwork.ratings.length > 0) {
        avgRating = artwork.ratings.reduce((sum, rating) => sum + rating.value, 0) / artwork.ratings.length;
      }
      
      return {
        ...artwork,
        likeCount,
        avgRating: parseFloat(avgRating.toFixed(1))
      };
    });

    return processedArtworks;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return [];
  }
}

export default async function SocialFeedPage() {
  const artworks = await getArtworksWithArtistsAndLikes();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Art Social Feed
        </h1>
        <p className="text-gray-300 text-center mb-10">
          Discover amazing artworks and talented artists from around the world
        </p>
        <ArtworkFeed artworks={artworks} />
      </div>
    </div>
  );
} 