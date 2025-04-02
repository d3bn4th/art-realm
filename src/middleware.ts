import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check if the request is for an authenticated route
  if (request.nextUrl.pathname.startsWith('/artist/dashboard') ||
      request.nextUrl.pathname.startsWith('/api/artist')) {
    
    // If no session is present, redirect to signin
    if (!session) {
      const signinUrl = new URL('/auth/signin', request.url);
      signinUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signinUrl);
    }

    // Check if the user is an artist
    if (session.role !== 'ARTIST') {
      return NextResponse.redirect(new URL('/', request.url));
    }

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