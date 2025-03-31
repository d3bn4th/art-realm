import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the token from the request headers
  const token = request.headers.get('authorization')?.split(' ')[1];

  // Check if the request is for an authenticated route
  if (request.nextUrl.pathname.startsWith('/artist/dashboard') ||
      request.nextUrl.pathname.startsWith('/api/artist')) {
    
    // If no token is present, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // In a real application, you would:
    // 1. Verify the JWT token
    // 2. Check user permissions
    // 3. Handle token expiration

    // For now, we'll just check if the token exists
    return NextResponse.next();
  }

  // Allow all other requests
  return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    '/artist/dashboard/:path*',
    '/api/artist/:path*'
  ]
}; 