'use client';

import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
  readonly?: boolean;
  showValue?: boolean;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  onChange,
  readonly = false,
  showValue = false
}: StarRatingProps) {
  const [activeRating, setActiveRating] = useState(rating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setActiveRating(rating);
  }, [rating]);

  const handleClick = (value: number) => {
    if (readonly) return;
    setActiveRating(value);
    onChange?.(value);
  };

  const handleMouseEnter = (value: number) => {
    if (readonly) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  // Size-dependent styles
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const containerClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  const valueClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const starClasses = `${sizeClasses[size]} text-yellow-400 transition-transform ${readonly ? '' : 'cursor-pointer hover:scale-110'}`;

  return (
    <div className="flex items-center">
      <div className={`flex items-center ${containerClasses[size]}`}>
        {[...Array(maxRating)].map((_, i) => {
          const value = i + 1;
          const filled = value <= (hoverRating || activeRating);
          
          return (
            <span
              key={i}
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
              className={`${readonly ? '' : 'cursor-pointer'}`}
            >
              {filled ? (
                <StarIcon className={starClasses} />
              ) : (
                <StarOutlineIcon className={starClasses} />
              )}
            </span>
          );
        })}
      </div>
      
      {showValue && (
        <span className={`ml-2 font-medium text-white ${valueClasses[size]}`}>
          {activeRating.toFixed(1)}
        </span>
      )}
    </div>
  );
} 