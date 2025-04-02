import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Add explicit typing to fix linter errors
export async function GET(_: unknown, { params }: { params: { id: string } }) {
  try {
    // Extract ID early to avoid errors
    const id = params.id;

    const artwork = await prisma.artwork.findUnique({
      where: {
        id,
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