import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fix the params handling for Next.js
export async function GET(_: unknown, { params }: { params: { id: string } }) {
  try {
    // Ensure params is used after awaiting any promises
    const id = params.id;
    
    const artist = await prisma.user.findUnique({
      where: {
        id,
        role: 'ARTIST',
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        image: true,
        specialties: true,
        artworks: {
          select: {
            id: true,
            title: true,
            image: true,
            price: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!artist) {
      return new NextResponse('Artist not found', { status: 404 });
    }

    return NextResponse.json(artist);
  } catch (error) {
    console.error('Error fetching artist:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 