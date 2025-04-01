import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Most basic format without explicit typing, following Next.js 15 examples
export async function GET(req, { params }) {
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