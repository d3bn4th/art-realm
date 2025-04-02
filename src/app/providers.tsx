'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from './context/CartContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0}>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
} 