'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  bidder: {
    id: string;
    name: string;
  };
}

interface Auction {
  id: string;
  startTime: string;
  endTime: string;
  startingPrice: number;
  currentPrice: number;
  status: string;
  artwork: {
    id: string;
    title: string;
    description: string;
    image: string;
    artist: {
      id: string;
      name: string;
      image: string | null;
    };
  };
  bids: Bid[];
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await fetch('/api/auctions');
        if (!response.ok) {
          throw new Error('Failed to fetch auctions');
        }
        const data = await response.json();
        setAuctions(data);
      } catch (err) {
        setError('Error loading auctions. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAuctions();

    // Refresh auctions every 30 seconds
    const interval = setInterval(fetchAuctions, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Live Auctions</h1>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Live Auctions</h1>
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Live Auctions</h1>
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-md text-center">
          <h3 className="text-xl font-semibold mb-2">No active auctions</h3>
          <p className="text-gray-600">Check back soon for upcoming auction events!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Live Auctions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {auctions.map((auction) => (
          <div key={auction.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-64 w-full">
              <Image
                src={auction.artwork.image}
                alt={auction.artwork.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <Link href={`/auctions/${auction.id}`}>
                <h2 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                  {auction.artwork.title}
                </h2>
              </Link>
              
              <p className="text-gray-600 mt-1">
                By <Link href={`/artists/${auction.artwork.artist.id}`} className="hover:underline">
                  {auction.artwork.artist.name}
                </Link>
              </p>
              
              <div className="mt-3">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Current bid:</span>
                  <span className="font-bold text-green-600">₹{auction.currentPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Ending in:</span>
                  <span className="font-medium text-orange-600">
                    {formatDistanceToNow(new Date(auction.endTime), { addSuffix: true })}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <Link 
                  href={`/auctions/${auction.id}`}
                  className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  View Auction
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 