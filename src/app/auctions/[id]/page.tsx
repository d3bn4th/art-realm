'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow, format } from 'date-fns';

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
    category: string;
    materials: string[];
    artist: {
      id: string;
      name: string;
      image: string | null;
    };
  };
  bids: Bid[];
}

export default function AuctionDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { status } = useSession();
  
  const [auction, setAuction] = useState<Auction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);
  const [bidLoading, setBidLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const fetchAuction = useCallback(async () => {
    try {
      const response = await fetch(`/api/auctions/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch auction');
      }
      const data = await response.json();
      setAuction(data);
      
      // Set minimum bid amount
      if (data && !bidAmount) {
        setBidAmount(Math.ceil(data.currentPrice * 1.05)); // 5% higher than current price
      }
    } catch (err) {
      setError('Error loading auction. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id, bidAmount]);

  useEffect(() => {
    fetchAuction();
    
    // Refresh auction data every 15 seconds
    const interval = setInterval(fetchAuction, 15000);
    return () => clearInterval(interval);
  }, [fetchAuction]);

  useEffect(() => {
    if (!auction) return;
    
    const updateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(auction.endTime);
      if (now >= end) {
        setTimeRemaining('Auction ended');
        clearInterval(timer);
      } else {
        setTimeRemaining(formatDistanceToNow(end, { addSuffix: true }));
      }
    };
    
    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 1000);
    
    return () => clearInterval(timer);
  }, [auction]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status !== 'authenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/auctions/${id}`));
      return;
    }
    
    if (!auction) return;
    
    // Validation
    if (bidAmount <= auction.currentPrice) {
      setBidError('Bid must be higher than the current price');
      return;
    }
    
    setBidError(null);
    setBidSuccess(null);
    setBidLoading(true);
    
    try {
      const response = await fetch('/api/auctions/bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auctionId: id,
          amount: bidAmount,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bid');
      }
      
      // Success
      setBidSuccess('Your bid was placed successfully!');
      fetchAuction(); // Refresh auction data
      
      // Reset success message after a few seconds
      setTimeout(() => {
        setBidSuccess(null);
      }, 5000);
    } catch (err: Error | unknown) {
      setBidError(err instanceof Error ? err.message : 'Failed to place bid');
    } finally {
      setBidLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <p className="text-red-700">{error || 'Auction not found'}</p>
        </div>
        <div className="mt-4">
          <Link href="/auctions" className="text-blue-600 hover:underline">
            ← Back to auctions
          </Link>
        </div>
      </div>
    );
  }

  const auctionEnded = new Date(auction.endTime) <= new Date();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-6">
        <Link href="/auctions" className="text-blue-600 hover:underline inline-flex items-center">
          ← Back to auctions
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Artwork Image */}
        <div className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={auction.artwork.image}
            alt={auction.artwork.title}
            fill
            className="object-contain"
          />
        </div>
        
        {/* Auction Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{auction.artwork.title}</h1>
          
          <div className="mb-4">
            <Link href={`/artists/${auction.artwork.artist.id}`} className="text-blue-600 hover:underline">
              By {auction.artwork.artist.name}
            </Link>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700">{auction.artwork.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-600 mb-1">Category</div>
              <div className="font-medium">{auction.artwork.category}</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-600 mb-1">Materials</div>
              <div className="font-medium">{auction.artwork.materials.join(', ')}</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-600 mb-1">Starting Price</div>
              <div className="font-medium">₹{auction.startingPrice.toLocaleString()}</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-600 mb-1">Current Bid</div>
              <div className="font-bold text-xl text-green-600">
                ₹{auction.currentPrice.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-md p-5 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">Auction Ends</div>
                <div className="font-medium">
                  {format(new Date(auction.endTime), 'PPp')}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Time Remaining</div>
                <div className={`font-bold ${auctionEnded ? 'text-red-600' : 'text-orange-600'}`}>
                  {timeRemaining}
                </div>
              </div>
            </div>
          </div>
          
          {/* Bidding Form */}
          {!auctionEnded && auction.status === 'active' ? (
            <div className="border border-gray-200 rounded-md p-5">
              <h3 className="text-xl font-semibold mb-4">Place Your Bid</h3>
              
              {bidSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <p className="text-green-700">{bidSuccess}</p>
                </div>
              )}
              
              {bidError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-red-700">{bidError}</p>
                </div>
              )}
              
              <form onSubmit={handleBid}>
                <div className="mb-4">
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Bid Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="bidAmount"
                    min={auction.currentPrice + 1}
                    step="100"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum bid: ₹{(auction.currentPrice + 1).toLocaleString()}
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={bidLoading || status !== 'authenticated'}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                    bidLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : status !== 'authenticated'
                      ? 'bg-gray-500'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {bidLoading ? 'Processing...' : status !== 'authenticated' ? 'Sign in to bid' : 'Place Bid'}
                </button>
                
                {status !== 'authenticated' && (
                  <p className="text-sm text-center mt-2">
                    <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(`/auctions/${id}`)}`} className="text-blue-600 hover:underline">
                      Sign in
                    </Link>
                    {' '}to participate in this auction
                  </p>
                )}
              </form>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-md p-5 bg-gray-50 text-center">
              <h3 className="text-xl font-semibold mb-2">
                {auction.status === 'ended' ? 'Auction Ended' : 'Auction Closed'}
              </h3>
              <p className="text-gray-600">
                This auction is no longer accepting bids.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Bid History */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Bid History</h2>
        
        {auction.bids.length > 0 ? (
          <div className="overflow-hidden border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Bidder
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auction.bids.map((bid) => (
                  <tr key={bid.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{bid.bidder.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">₹{bid.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {format(new Date(bid.createdAt), 'PPpp')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 border border-gray-200 rounded-md bg-gray-50">
            <p className="text-gray-600">No bids have been placed yet</p>
          </div>
        )}
      </div>
    </div>
  );
} 