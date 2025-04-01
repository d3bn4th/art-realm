import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(
  request: NextRequest,
  { params }: any
) {
  const id = params.id;
  
  try {
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