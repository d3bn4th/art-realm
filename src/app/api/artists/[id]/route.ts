import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Context = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, context: Context) {
  const { params } = context;
  
  try {
    const artist = await prisma.user.findUnique({
      where: {
        id: params.id,
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