'use client';

import { useState, useEffect } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const [value, setValue] = useState(quantity);

  useEffect(() => {
    setValue(quantity);
  }, [quantity]);

  const handleDecrease = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      onQuantityChange(newValue);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      onQuantityChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value);
    if (!isNaN(inputValue)) {
      const newValue = Math.max(min, Math.min(max, inputValue));
      setValue(newValue);
      onQuantityChange(newValue);
    }
  };

  // Size-dependent styles
  const iconClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const inputClasses = {
    sm: 'w-12 text-sm',
    md: 'w-16 text-base',
    lg: 'w-20 text-lg font-bold',
  };

  const buttonClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  return (
    <div className="flex items-stretch rounded-lg overflow-hidden shadow-lg border border-gray-700">
      <button 
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className={`${buttonClasses[size]} flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 transition-colors disabled:opacity-50 disabled:pointer-events-none disabled:hover:bg-blue-800 shadow-inner`}
        aria-label="Decrease quantity"
      >
        <MinusIcon className={iconClasses[size]} />
      </button>
      
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className={`${inputClasses[size]} bg-black text-center text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold`}
        aria-label="Quantity"
      />
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className={`${buttonClasses[size]} flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 transition-colors disabled:opacity-50 disabled:pointer-events-none disabled:hover:bg-blue-800 shadow-inner`}
        aria-label="Increase quantity"
      >
        <PlusIcon className={iconClasses[size]} />
      </button>
    </div>
  );
} 