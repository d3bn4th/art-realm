'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { formatToRupees } from '@/utils/currency';
import { motion } from 'framer-motion';

interface Artist {
  id: string;
  name: string;
  email: string;
}

interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isEcoFriendly: boolean;
  artist: Artist;
}

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('/api/artworks');
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        const data = await response.json();
        setArtworks(data);
      } catch (error) {
        console.error('Error:', error);
        
        // Fallback to sample data if API fetch fails
        try {
          // Import sample artworks from the data file
          import('@/app/data/artworks').then(module => {
            // Convert the sample data to match the Artwork interface
            const sampleArtworks = module.artworks.map(artwork => ({
              id: artwork.id.toString(),
              title: artwork.title,
              description: artwork.description,
              price: artwork.price,
              image: artwork.image,
              category: artwork.category,
              isEcoFriendly: false, // Default value
              artist: {
                id: '1',
                name: artwork.artist,
                email: 'sample@example.com'
              }
            }));
            setArtworks(sampleArtworks);
            toast.success('Using sample artworks data');
          });
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          toast.error('Failed to load artworks. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        {/* Container for the animated images */}
        <div className="relative w-full h-full">
          {/* Center Image */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 z-20"
          >
            {/* <Image
              src="/images/hero/center-image.jpg"
              alt="Central Art"
              fill
              className="object-cover rounded-full"
              priority
            /> */}
          </motion.div>

          {/* Left Image */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.7 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3"
          >
            <Image
              src="/images/hero/left-image.jpg"
              alt="Sustainable Art"
              fill
              className="object-cover rounded-tr-3xl"
              priority
            />
          </motion.div>

          {/* Top Image */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-2/3"
          >
            <Image
              src="/images/hero/top-image.jpg"
              alt="Eco Art"
              fill
              className="object-cover rounded-b-3xl"
              priority
            />
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.9 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3"
          >
            <Image
              src="/images/hero/right-image.jpg"
              alt="Nature Art"
              fill
              className="object-cover rounded-tl-3xl"
              priority
            />
          </motion.div>

          {/* Top Left Corner Image */}
          <motion.div
            initial={{ x: -100, y: -100, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 0.7 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.6 }}
            className="absolute left-[10%] top-[10%] w-1/4 h-1/4"
          >
            <Image
              src="/images/hero/top-left-image.jpg"
              alt="Eco-friendly Creation"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </motion.div>

          {/* Top Right Corner Image */}
          <motion.div
            initial={{ x: 100, y: -100, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 0.7 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.7 }}
            className="absolute right-[10%] top-[10%] w-1/4 h-1/4"
          >
            <Image
              src="/images/hero/top-right-image.jpg"
              alt="Natural Materials"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </motion.div>

          {/* Bottom Left Corner Image */}
          <motion.div
            initial={{ x: -100, y: 100, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 0.7 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.8 }}
            className="absolute left-[10%] bottom-[10%] w-1/4 h-1/4"
          >
            <Image
              src="/images/hero/bottom-left-image.jpg"
              alt="Recycled Art"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </motion.div>

          {/* Bottom Right Corner Image */}
          <motion.div
            initial={{ x: 100, y: 100, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 0.7 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.9 }}
            className="absolute right-[10%] bottom-[10%] w-1/4 h-1/4"
          >
            <Image
              src="/images/hero/bottom-right-image.jpg"
              alt="Sustainable Design"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </motion.div>

          {/* Bottom Center Image */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 1.0 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-1/3"
          >
            <Image
              src="/images/hero/center.jpg"
              alt="Earth-friendly Art"
              fill
              className="object-cover rounded-t-3xl"
              priority
            />
          </motion.div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute inset-0 z-30 flex items-center justify-center"
        >
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Where Art Meets Sustainability
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Experience extraordinary artworks crafted with love for both creativity and our planet
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9 }}
              className="flex justify-center gap-4"
            >
              <Link 
                href="/eco-friendly"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full transition-all transform hover:scale-105"
              >
                Explore Eco-Friendly Art
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Featured Artworks Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-between items-center mb-12"
        >
          <h2 className="text-4xl font-bold">Featured Artworks</h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500">Supporting Eco-Friendly Artists</span>
          </div>
        </motion.div>
        
        {artworks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No artworks found.</p>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="group bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-green-500 transition-all transform hover:scale-105"
              >
                <div className="relative aspect-square">
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  {artwork.isEcoFriendly && (
                    <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Eco-Friendly
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-green-400 transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {artwork.description}
                  </p>
                  <p className="text-green-400 font-bold mb-2">
                    {formatToRupees(artwork.price)}
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    By {artwork.artist.name}
                  </p>
                  <Link
                    href={`/artwork/${artwork.id}`}
                    className="block w-full text-center bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Eco Impact Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-green-900/20 backdrop-blur-sm py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Environmental Impact</h2>
            <p className="text-gray-300">Supporting artists who create with nature in mind</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 p-6 rounded-xl text-center"
            >
              <div className="text-4xl font-bold text-green-500 mb-2">100%</div>
              <div className="text-gray-300">Eco-Friendly Materials</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 p-6 rounded-xl text-center"
            >
              <div className="text-4xl font-bold text-green-500 mb-2">50+</div>
              <div className="text-gray-300">Sustainable Artists</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 p-6 rounded-xl text-center"
            >
              <div className="text-4xl font-bold text-green-500 mb-2">1000+</div>
              <div className="text-gray-300">Trees Planted</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
