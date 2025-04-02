'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

interface CartActionButtonsProps {
  isInCart: boolean;
  onAddToCart: (quantity: number) => void;
  onViewCart?: () => void;
  quantity?: number;
  addQuantity?: number;
}

export default function CartActionButtons({
  isInCart,
  onAddToCart,
  onViewCart,
  quantity = 0,
  addQuantity = 1
}: CartActionButtonsProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    onAddToCart(addQuantity);
    
    // Reset animation after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  return (
    <div className="grid grid-cols-1 gap-3 w-full">
      {isInCart ? (
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-300 ${
            isAnimating ? 'scale-105' : ''
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          Add Again {quantity > 0 && `(${quantity} in cart)`}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-300 ${
            isAnimating ? 'scale-105' : ''
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          Add to Cart
        </button>
      )}

      <Link
        href="/cart"
        onClick={onViewCart}
        className="w-full py-3 px-4 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors"
      >
        <ShoppingBagIcon className="h-5 w-5 mr-2" />
        View Cart
      </Link>
    </div>
  );
} 