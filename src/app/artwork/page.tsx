'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getArtworkImagePath } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import ArtworkCard from '@/components/ArtworkCard';

interface Artist {
  id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  specialties: string[];
}

interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isEcoFriendly: boolean;
  materials: string[];
  artistId: string;
  artist: Artist;
}

export default function ArtworkCatalog() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [isEcoFriendly, setIsEcoFriendly] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('/api/artworks');
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        const data = await response.json();
        setArtworks(data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((artwork: Artwork) => artwork.category))
        ) as string[];
        setCategories(uniqueCategories);
        
        // Find max price for price range
        const maxPrice = Math.max(...data.map((artwork: Artwork) => artwork.price));
        setPriceRange([0, maxPrice]);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load artworks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || artwork.category === selectedCategory;
    const matchesPrice = artwork.price >= priceRange[0] && artwork.price <= priceRange[1];
    const matchesEcoFriendly = isEcoFriendly === null || artwork.isEcoFriendly === isEcoFriendly;

    return matchesSearch && matchesCategory && matchesPrice && matchesEcoFriendly;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Artworks</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-gray-900 p-6 rounded-lg space-y-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search artworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 text-white px-3"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <Label>Price Range (₹)</Label>
                <div className="flex flex-col space-y-2">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              {/* Eco-Friendly Filter */}
              <div className="space-y-2">
                <Label htmlFor="eco-friendly">Eco-Friendly</Label>
                <select
                  id="eco-friendly"
                  value={isEcoFriendly === null ? '' : isEcoFriendly.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setIsEcoFriendly(value === '' ? null : value === 'true');
                  }}
                  className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 text-white px-3"
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-gray-800">
                <p className="text-gray-400">
                  Showing {filteredArtworks.length} of {artworks.length} artworks
                </p>
              </div>
            </div>
          </div>

          {/* Artworks Grid */}
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArtworks.map((artwork) => (
                <ArtworkCard 
                  key={artwork.id}
                  artwork={{
                    id: artwork.id,
                    title: artwork.title,
                    price: artwork.price,
                    image: getArtworkImagePath(artwork.image),
                    category: artwork.category,
                    isEcoFriendly: artwork.isEcoFriendly,
                    artist: {
                      id: artwork.artistId,
                      name: artwork.artist.name,
                    }
                  }}
                  showRating={true}
                  showArtist={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 