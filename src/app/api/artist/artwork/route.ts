import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ARTIST') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { title, description, price, category, materials, isEcoFriendly, image } = data;

    // Validate required fields
    if (!title || !description || !price || !category || !materials || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create artwork
    const artwork = await prisma.artwork.create({
      data: {
        title,
        description,
        price,
        category,
        materials,
        isEcoFriendly,
        image,
        artistId: session.user.id,
      },
    });

    return NextResponse.json(artwork);
  } catch (error) {
    console.error('Create artwork error:', error);
    return NextResponse.json(
      { error: 'Failed to create artwork' },
      { status: 500 }
    );
  }
} 