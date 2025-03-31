import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'ARTIST' | 'BUYER';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'ARTIST' | 'BUYER';
  }
} 