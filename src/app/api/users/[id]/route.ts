import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

// Add explicit typing to fix linter errors
export async function GET(_: unknown, { params }: { params: { id: string } }) {
  try {
    console.log('GET /api/users/:id - Request for user ID:', params.id);
    
    const session = await getServerSession(authOptions);
    console.log('Session data:', session ? { 
      userId: session.user?.id, 
      userEmail: session.user?.email,
      authenticated: !!session
    } : 'No session');
    
    if (!session) {
      console.log('Unauthorized - No session found');
      return new NextResponse('Unauthorized - No session found', { status: 401 });
    }

    if (!session.user?.id) {
      console.log('Unauthorized - Session exists but no user ID');
      return new NextResponse('Unauthorized - Session missing user ID', { status: 401 });
    }

    // Users can only access their own profile
    if (session.user.id !== params.id) {
      console.log('Forbidden - User tried to access another user profile', {
        sessionUserId: session.user.id,
        requestedId: params.id,
        role: session.user.role
      });
      return new NextResponse('Forbidden - You can only view your own profile', { status: 403 });
    }

    console.log('Fetching user from database, ID:', params.id);
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        specialties: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      console.log('User not found for ID:', params.id);
      return new NextResponse('User not found', { status: 404 });
    }

    console.log('User found successfully');
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in GET /api/users/:id:', error);
    return new NextResponse(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log('PATCH /api/users/:id - Request to update user ID:', params.id);
    
    const session = await getServerSession(authOptions);
    console.log('Session data:', session ? { 
      userId: session.user?.id, 
      authenticated: !!session
    } : 'No session');
    
    if (!session) {
      console.log('Unauthorized - No session found');
      return new NextResponse('Unauthorized - No session found', { status: 401 });
    }

    if (!session.user?.id) {
      console.log('Unauthorized - Session exists but no user ID');
      return new NextResponse('Unauthorized - Session missing user ID', { status: 401 });
    }

    if (session.user.id !== params.id) {
      console.log('Forbidden - User tried to update another user profile', {
        sessionUserId: session.user.id,
        requestedId: params.id,
        role: session.user.role
      });
      return new NextResponse('Forbidden - You can only update your own profile', { status: 403 });
    }

    const body = await req.json();
    const { name, bio, location, specialties, image } = body;

    console.log('Updating user in database, ID:', params.id, {
      fieldsToUpdate: Object.keys(body)
    });

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        bio,
        location,
        specialties,
        image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        specialties: true,
        image: true,
        role: true,
      },
    });

    console.log('User updated successfully');
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in PATCH /api/users/:id:', error);
    return new NextResponse(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
} 