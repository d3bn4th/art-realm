import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

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
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.id !== params.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await request.json();
    const { name, bio, location, specialties, image } = body;

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

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 