'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import QuantitySelector from '@/components/ui/QuantitySelector';
import CartActionButtons from '@/components/ui/CartActionButtons';

interface BuyButtonProps {
  artwork: {
    id: string;
    title: string;
    price: number;
    image: string;
    artistId: string;
    artistName: string;
  };
  showQuantity?: boolean;
  redirectToCart?: boolean;
}

export default function BuyButton({ 
  artwork,
  showQuantity = false,
  redirectToCart = false
}: BuyButtonProps) {
  const router = useRouter();
  const { addToCart, updateQuantity, cart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Check if item already exists in cart
  const existingItem = cart.items.find(item => item.id === artwork.id);
  const itemQuantity = existingItem ? existingItem.quantity : 0;

  const handleAddToCart = (addQuantity: number) => {
    if (existingItem) {
      // If item exists in cart, update quantity with the selected amount
      updateQuantity(artwork.id, existingItem.quantity + addQuantity);
    } else {
      // If item doesn't exist, add it with the initial quantity
      addToCart({
        id: artwork.id,
        title: artwork.title,
        price: artwork.price,
        image: artwork.image,
        artistId: artwork.artistId,
        artistName: artwork.artistName,
      });

      // If quantity is more than 1, update it after adding
      if (addQuantity > 1) {
        // Need to wait a tick for the item to be added first
        setTimeout(() => {
          updateQuantity(artwork.id, addQuantity);
        }, 0);
      }
    }

    toast.success(`${addQuantity} item(s) added to cart`);
    
    if (redirectToCart) {
      router.push('/cart');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleViewCart = () => {
    router.push('/cart');
  };

  return (
    <div className="flex flex-col space-y-4">
      {showQuantity && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-medium text-gray-300">
            Quantity:
          </span>
          <QuantitySelector 
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            size="md"
          />
        </div>
      )}
      
      <CartActionButtons 
        isInCart={itemQuantity > 0}
        onAddToCart={handleAddToCart}
        onViewCart={handleViewCart}
        quantity={itemQuantity}
        addQuantity={quantity}
      />
    </div>
  );
} 