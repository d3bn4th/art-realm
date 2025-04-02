import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/artworks/[id]/rating
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if artwork exists
    const artwork = await prisma.artwork.findUnique({
      where: { id },
    });

    if (!artwork) {
      return NextResponse.json(
        { message: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Get all ratings for this artwork
    const ratings = await prisma.rating.findMany({
      where: { artworkId: id },
    });

    // Calculate average rating
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? parseFloat((ratings.reduce((sum, rating) => sum + rating.value, 0) / totalRatings).toFixed(1))
      : 0;

    // Get user's rating if they're logged in
    let userRating = null;
    const session = await getServerSession(authOptions);
    
    if (session?.user?.id) {
      const existingRating = await prisma.rating.findUnique({
        where: {
          userId_artworkId: {
            userId: session.user.id,
            artworkId: id,
          },
        },
      });
      
      if (existingRating) {
        userRating = existingRating.value;
      }
    }

    return NextResponse.json({
      averageRating,
      totalRatings,
      userRating,
    });
  } catch (error) {
    console.error('Error fetching artwork ratings:', error);
    return NextResponse.json(
      { message: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

// POST /api/artworks/[id]/rating
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to rate artworks' },
        { status: 401 }
      );
    }

    // Check if artwork exists
    const artwork = await prisma.artwork.findUnique({
      where: { id },
    });

    if (!artwork) {
      return NextResponse.json(
        { message: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate rating value
    const ratingValue = body.rating;
    if (typeof ratingValue !== 'number' || ratingValue < 1 || ratingValue > 5) {
      return NextResponse.json(
        { message: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    // Upsert the rating (update if exists, create if not)
    await prisma.rating.upsert({
      where: {
        userId_artworkId: {
          userId: session.user.id,
          artworkId: id,
        },
      },
      update: {
        value: ratingValue,
      },
      create: {
        userId: session.user.id,
        artworkId: id,
        value: ratingValue,
      },
    });

    // Get updated average after adding the new rating
    const ratings = await prisma.rating.findMany({
      where: { artworkId: id },
    });

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? parseFloat((ratings.reduce((sum, rating) => sum + rating.value, 0) / totalRatings).toFixed(1))
      : 0;

    return NextResponse.json({
      message: 'Rating submitted successfully',
      averageRating,
      totalRatings,
    });
  } catch (error) {
    console.error('Error submitting artwork rating:', error);
    return NextResponse.json(
      { message: 'Failed to submit rating' },
      { status: 500 }
    );
  }
} 