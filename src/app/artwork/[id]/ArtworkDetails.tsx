'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import { formatToRupees } from '@/utils/currency';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Artwork {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  artist: string;
  image: string;
}

interface ArtworkDetailsProps {
  artwork: Artwork;
  relatedArtworks: Artwork[];
}

export default function ArtworkDetails({ artwork, relatedArtworks }: ArtworkDetailsProps) {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
      {/* Left Column - Image */}
      <div className="lg:max-w-lg lg:self-end">
        <div className="overflow-hidden rounded-lg">
          <div className="relative aspect-square">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="mt-10 lg:mt-0 lg:pl-8">
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-black">{artwork.title}</h1>
            <button 
              onClick={() => setIsWishlist(!isWishlist)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <HeartIcon 
                className={classNames(
                  "w-6 h-6",
                  isWishlist ? "fill-red-500 stroke-red-500" : "stroke-gray-400"
                )} 
              />
            </button>
          </div>
          <h2 className="sr-only">Artwork information</h2>
          <p className="mt-2 text-3xl tracking-tight text-black">{formatToRupees(artwork.price)}</p>
        </div>

        {/* Artist Info */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-black">Artist</h3>
          <div className="mt-2 flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">{artwork.artist}</p>
              <Link href={`/artist/${artwork.artist.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-indigo-600 hover:text-indigo-500">
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mt-4">
          <p className="text-sm text-black">Category: {artwork.category}</p>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="sr-only">Description</h3>
          <p className="text-base text-black space-y-6">{artwork.description}</p>
        </div>

        {/* Actions */}
        <div className="mt-10 flex space-x-4">
          <button
            onClick={handleAddToCart}
            className={classNames(
              isAddedToCart
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-indigo-600 hover:bg-indigo-700',
              'flex-1 items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200'
            )}
          >
            {isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
          </button>
          <button
            className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-10 border-t border-gray-200 pt-10">
          <h3 className="text-sm font-medium text-black">Highlights</h3>
          <div className="prose prose-sm mt-4 text-black">
            <ul role="list" className="list-disc space-y-2 pl-4">
              <li>Original artwork</li>
              <li>Certificate of authenticity included</li>
              <li>Professional packaging and shipping</li>
              <li>Secure payment processing</li>
            </ul>
          </div>
        </div>

        {/* Shipping */}
        <div className="mt-10 border-t border-gray-200 pt-10">
          <h3 className="text-sm font-medium text-black">Shipping Information</h3>
          <p className="mt-4 text-sm text-black">
            This artwork ships worldwide. Please allow 5-7 business days for careful packaging 
            and shipping. All artworks are professionally packed to ensure safe delivery.
          </p>
        </div>

        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <div className="col-span-2 mt-20 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold mb-8 text-black">Related Artworks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArtworks.map((relatedArt) => (
                <Link href={`/artwork/${relatedArt.id}`} key={relatedArt.id}>
                  <div className="group">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={relatedArt.image}
                        alt={relatedArt.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-black">{relatedArt.title}</h3>
                    <p className="text-gray-600">{relatedArt.artist}</p>
                    <p className="mt-1 font-medium text-black">{formatToRupees(relatedArt.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 