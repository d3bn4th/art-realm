'use client';

import { useState, useEffect } from 'react';
import { formatToRupees } from '@/utils/currency';

interface Sale {
  id: string;
  artworkTitle: string;
  buyerName: string;
  price: number;
  date: string;
  status: 'pending' | 'shipped' | 'delivered';
}

export default function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchSales = async () => {
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockSales: Sale[] = [
          {
            id: '1',
            artworkTitle: 'Sunset by the Beach',
            buyerName: 'John Doe',
            price: 299.99,
            date: '2024-03-15',
            status: 'delivered',
          },
          {
            id: '2',
            artworkTitle: 'Mountain Landscape',
            buyerName: 'Jane Smith',
            price: 499.99,
            date: '2024-03-14',
            status: 'shipped',
          },
          {
            id: '3',
            artworkTitle: 'Abstract Dreams',
            buyerName: 'Mike Johnson',
            price: 199.99,
            date: '2024-03-13',
            status: 'pending',
          },
        ];

        setSales(mockSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  const filteredSales = filter === 'all' 
    ? sales 
    : sales.filter(sale => sale.status === filter);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.price, 0);
  const pendingCount = sales.filter(sale => sale.status === 'pending').length;
  const shippedCount = sales.filter(sale => sale.status === 'shipped').length;
  const deliveredCount = sales.filter(sale => sale.status === 'delivered').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading sales data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sales History</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatToRupees(totalRevenue)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Shipped Orders</h3>
            <p className="text-3xl font-bold text-blue-600">{shippedCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Delivered Orders</h3>
            <p className="text-3xl font-bold text-green-600">{deliveredCount}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* Sales Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artwork
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.artworkTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.buyerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatToRupees(sale.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        sale.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : sale.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 