'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { artworks } from '../data/artworks';
import { formatToRupees } from '@/utils/currency';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      ...artworks[0],
      quantity: 1
    }
  ]);

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 25;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-black">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-black mb-4">Your cart is empty</p>
              <Link
                href="/artwork"
                className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 p-4 bg-white rounded-lg shadow">
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-black">{item.title}</h3>
                    <p className="text-black">{item.artist}</p>
                    <p className="mt-1 text-black">{formatToRupees(item.price)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-black">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-black">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-black">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full bg-indigo-600 text-white text-center px-6 py-3 rounded-md hover:bg-indigo-500"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 