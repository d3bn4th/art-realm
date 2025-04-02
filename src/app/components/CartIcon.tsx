'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/app/context/CartContext';

export default function CartIcon() {
  const { cart } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemCount = cart.items.length;
  
  // Using useEffect to ensure we only render this on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Animation effect when items are added to cart
  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);
  
  if (!isClient) return null;
  
  return (
    <Link href="/cart" className="relative group">
      <ShoppingBagIcon 
        className={`h-6 w-6 text-gray-300 transition-transform group-hover:text-white ${
          isAnimating ? 'scale-125' : ''
        }`} 
        aria-hidden="true" 
      />
      
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
} 