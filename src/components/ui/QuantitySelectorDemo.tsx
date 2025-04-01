'use client';

import { useState } from 'react';
import QuantitySelector from './QuantitySelector';

export default function QuantitySelectorDemo() {
  const [quantity, setQuantity] = useState(1);
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };
  
  return (
    <div className="flex flex-col space-y-6 bg-gray-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Quantity Selector</h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Small:</span>
          <QuantitySelector 
            quantity={quantity} 
            onQuantityChange={handleQuantityChange} 
            size="sm" 
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Medium (Default):</span>
          <QuantitySelector 
            quantity={quantity} 
            onQuantityChange={handleQuantityChange} 
            size="md" 
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Large:</span>
          <QuantitySelector 
            quantity={quantity} 
            onQuantityChange={handleQuantityChange} 
            size="lg" 
          />
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        Current quantity: {quantity}
      </div>
    </div>
  );
} 