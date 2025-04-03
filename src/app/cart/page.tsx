'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { formatToRupees } from '@/utils/currency';
import QuantitySelector from '@/components/ui/QuantitySelector';

export default function Cart() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Fix hydration mismatch by only rendering cart data on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/checkout');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {!isClient || cart.items.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <ShoppingBagIcon className="h-20 w-20 mx-auto text-gray-600 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-400 mb-6">Looks like you haven&apos;t added any artwork to your cart yet.</p>
                <Link
                  href="/artwork"
                  className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-md"
                >
                  Browse Artworks
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {isClient && cart.items.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4 md:p-6 flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/4 aspect-square relative rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">{item.title}</h3>
                          <p className="text-gray-400">by {item.artistName}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-gray-300"
                          aria-label="Remove item"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-4 md:mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="text-white text-lg font-semibold">{formatToRupees(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <QuantitySelector
                            quantity={item.quantity}
                            onQuantityChange={(quantity) => updateQuantity(item.id, quantity)}
                            min={1}
                            max={10}
                            size="md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{isClient ? formatToRupees(cart.subtotal) : '₹0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (10%)</span>
                  <span>{isClient ? formatToRupees(cart.tax) : '₹0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{isClient ? formatToRupees(cart.shipping) : '₹0.00'}</span>
                </div>
                <div className="border-t border-gray-700 pt-4 flex justify-between font-semibold text-white">
                  <span>Total</span>
                  <span>{isClient ? formatToRupees(cart.total) : '₹0.00'}</span>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-md font-medium"
                disabled={!isClient || cart.items.length === 0 || isLoading}
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              
              {isClient && cart.items.length > 0 && (
                <button 
                  onClick={clearCart} 
                  className="w-full mt-4 text-gray-400 hover:text-gray-300 text-sm"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 