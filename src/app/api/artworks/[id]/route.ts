import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Context = {
  params: {
    id: string;
  };
};

// Using a simpler route handler format that should be compatible with Next.js 15
export async function GET(request: Request, context: Context) {
  const { params } = context;
  
  try {
    const id = params.id;

    const artwork = await prisma.artwork.findUnique({
      where: {
        id: id,
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    );
  }
} 