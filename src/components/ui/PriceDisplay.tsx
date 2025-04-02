'use client';

interface PriceDisplayProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'block' | 'compact';
  currency?: string;
  locale?: string;
}

export default function PriceDisplay({
  price,
  size = 'md',
  variant = 'inline',
  currency = '₹',
  locale = 'en-IN'
}: PriceDisplayProps) {
  // Format price with the given locale and currency
  const formattedPrice = `${currency}${price.toLocaleString(locale)}`;
  
  // Size-dependent text styles
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  // Variant-dependent container styles
  const containerStyles = {
    inline: 'inline-block bg-gray-800 rounded-lg px-6 py-4 border border-gray-700 shadow-md',
    block: 'block w-full bg-gray-800 rounded-lg p-4 border border-gray-700',
    compact: 'inline-flex items-center bg-gray-800 rounded-lg px-4 py-2 border border-gray-700',
  };
  
  return (
    <div className={containerStyles[variant]}>
      <p className={`${textSizes[size]} font-bold text-white`}>
        {formattedPrice}
      </p>
    </div>
  );
} 