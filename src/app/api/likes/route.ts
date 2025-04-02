import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'You must be logged in to perform this action' },
      { status: 401 }
    );
  }

  const userId = session.user.id as string;

  try {
    const { artworkId } = await request.json();

    if (!artworkId) {
      return NextResponse.json(
        { error: 'Artwork ID is required' },
        { status: 400 }
      );
    }

    // Check if the like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_artworkId: {
          userId,
          artworkId,
        },
      },
    });

    if (existingLike) {
      // Unlike - delete the like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({ 
        message: 'Artwork unliked successfully',
        action: 'unliked' 
      });
    } else {
      // Like - create a new like
      await prisma.like.create({
        data: {
          userId,
          artworkId,
        },
      });

      return NextResponse.json({ 
        message: 'Artwork liked successfully',
        action: 'liked' 
      });
    }
  } catch (error) {
    console.error('Error processing like:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 