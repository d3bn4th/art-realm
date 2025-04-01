'use client';

import { useState } from 'react';
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
            {cart.items.length === 0 ? (
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
                {cart.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
                    <div className="relative w-full sm:w-32 h-32 mx-auto sm:mx-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                          <p className="text-gray-400">by {item.artistName}</p>
                          <p className="mt-1 text-white font-medium">{formatToRupees(item.price)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-white h-6"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                      
                      <div className="flex items-center mt-4">
                        <label className="text-sm text-gray-400 mr-3">Quantity:</label>
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(newQuantity) => {
                            if (newQuantity === 0) {
                              removeFromCart(item.id);
                            } else {
                              updateQuantity(item.id, newQuantity);
                            }
                          }}
                          min={1}
                          size="sm"
                        />
                        <div className="ml-auto text-right">
                          <span className="text-gray-400 text-sm">Subtotal:</span>
                          <p className="text-white font-medium">{formatToRupees(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => clearCart()}
                    variant="outline"
                    className="tmt-6 w-24 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-md py-3"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatToRupees(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{formatToRupees(cart.shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>{formatToRupees(cart.tax)}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between font-semibold text-white">
                    <span>Total</span>
                    <span>{formatToRupees(cart.total)}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={cart.items.length === 0 || isLoading}
                className="mt-6 w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-md py-3"
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              
              <div className="mt-6 text-sm text-gray-400">
                <p className="flex items-center justify-center gap-1">
                  <span>Need help?</span>
                  <Link href="/contact" className="text-blue-400 hover:text-blue-300">
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 