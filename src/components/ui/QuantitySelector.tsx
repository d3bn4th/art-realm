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
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const inputClasses = {
    sm: 'w-10 text-sm',
    md: 'w-12 text-base',
    lg: 'w-14 text-lg',
  };

  return (
    <div className="flex items-stretch">
      <button 
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className="flex-1 flex items-center justify-center rounded-l-md bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:pointer-events-none disabled:hover:bg-gray-800"
        aria-label="Decrease quantity"
      >
        <MinusIcon className={iconClasses[size]} />
      </button>
      
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className={`${inputClasses[size]} bg-gray-900 border-t border-b border-gray-700 text-center text-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
        aria-label="Quantity"
      />
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className="flex-1 flex items-center justify-center rounded-r-md bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:pointer-events-none disabled:hover:bg-gray-800"
        aria-label="Increase quantity"
      >
        <PlusIcon className={iconClasses[size]} />
      </button>
    </div>
  );
} 