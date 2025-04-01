import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the artist from the database
    const artist = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!artist || artist.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Only artists can upload artworks' }, { status: 403 });
    }

    const data = await request.json();

    // Create the artwork
    const artwork = await prisma.artwork.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        materials: data.materials,
        isEcoFriendly: data.isEcoFriendly,
        image: data.image,
        artistId: artist.id,
      },
    });

    return NextResponse.json(artwork);
  } catch (error) {
    console.error('Error creating artwork:', error);
    return NextResponse.json(
      { error: 'Failed to create artwork' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isEcoFriendly = searchParams.get('isEcoFriendly') === 'true';
    const artistId = searchParams.get('artistId');

    const where = {
      ...(category && { category }),
      ...(isEcoFriendly && { isEcoFriendly: true }),
      ...(artistId && { artistId }),
    };

    // Test database connection first
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Check your connection string.' },
        { status: 500 }
      );
    }

    const artworks = await prisma.artwork.findMany({
      where,
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  } finally {
    // Properly disconnect to avoid connection pool issues
    await prisma.$disconnect();
  }
} 