import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Next.js 15 requires this explicit typing for route params
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;

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