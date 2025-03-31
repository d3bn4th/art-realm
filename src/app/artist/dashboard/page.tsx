'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ArtistStats {
  totalArtworks: number;
  totalSales: number;
  averageRating: number;
}

export default function ArtistDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<ArtistStats>({
    totalArtworks: 0,
    totalSales: 0,
    averageRating: 0,
  });

  useEffect(() => {
    // In a real application, fetch artist stats from the API
    // For now, using mock data
    setStats({
      totalArtworks: 12,
      totalSales: 5,
      averageRating: 4.5,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Artist Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Artworks</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalArtworks}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalSales}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Average Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.averageRating}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/artist/upload')}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Upload New Artwork
            </button>
            <button
              onClick={() => router.push('/artist/sales')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Sales History
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-gray-600">New artwork sale - &ldquo;Abstract Dreams&rdquo;</p>
              <p className="text-sm text-gray-400">2 hours ago</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600">New review received - 5 stars</p>
              <p className="text-sm text-gray-400">1 day ago</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600">Artwork uploaded - &ldquo;Mountain Sunset&rdquo;</p>
              <p className="text-sm text-gray-400">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 