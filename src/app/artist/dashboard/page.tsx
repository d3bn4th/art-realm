'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { PlusIcon, ChartBarIcon, ShoppingBagIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ArtistStats {
  totalArtworks: number;
  totalSales: number;
  averageRating: number;
  recentOrders: Order[];
  recentArtworks: Artwork[];
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  artwork: {
    title: string;
    image: string;
  };
  buyer: {
    name: string;
  };
}

interface Artwork {
  id: string;
  title: string;
  price: number;
  image: string;
  createdAt: string;
}

export default function ArtistDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin?callbackUrl=/artist/dashboard');
    },
  });

  const [stats, setStats] = useState<ArtistStats>({
    totalArtworks: 0,
    totalSales: 0,
    averageRating: 0,
    recentOrders: [],
    recentArtworks: []
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role !== 'ARTIST') {
        toast.error('Only artists can access this page');
        router.push('/');
        return;
      }
      fetchDashboardData();
    }
  }, [status, session, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/artist/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ARTIST') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Artist Dashboard</h1>
          <Link
            href="/artist/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Upload New Artwork
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100">
                <PhotoIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Artworks</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalArtworks}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <ShoppingBagIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
                <p className="text-3xl font-bold text-green-600">${stats.totalSales}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Rating</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center p-4 border rounded-lg">
                    <Image
                      src={order.artwork.image}
                      alt={order.artwork.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{order.artwork.title}</h3>
                      <p className="text-sm text-gray-500">Buyer: {order.buyer.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm font-medium text-gray-900">${order.totalAmount}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/artist/orders"
                className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all orders →
              </Link>
            </div>
          </div>

          {/* Recent Artworks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Artworks</h2>
              <div className="grid grid-cols-2 gap-4">
                {stats.recentArtworks.map((artwork) => (
                  <div key={artwork.id} className="group relative">
                    <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        width={300}
                        height={300}
                        className="object-cover group-hover:opacity-75"
                      />
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium text-gray-900">{artwork.title}</h3>
                      <p className="text-sm font-medium text-gray-900">${artwork.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/artist/artworks"
                className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all artworks →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 