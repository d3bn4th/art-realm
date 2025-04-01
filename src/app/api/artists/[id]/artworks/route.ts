import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = {
  id: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const isEcoFriendly = searchParams.get('isEcoFriendly') === 'true';

    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const where = {
      artistId: context.params.id,
      ...(category && { category }),
      ...(isEcoFriendly && { isEcoFriendly: true }),
    };

    // Determine the order by based on sortBy parameter
    let orderBy = {};
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Get the artworks with pagination
    const artworks = await prisma.artwork.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Get the total count for pagination
    const totalCount = await prisma.artwork.count({ where });
    const totalPages = Math.ceil(totalCount / limit);

    // Get all categories for filtering options
    const categories = await prisma.artwork.findMany({
      where: { artistId: context.params.id },
      select: { category: true },
      distinct: ['category'],
    });

    return NextResponse.json({
      artworks,
      pagination: {
        total: totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
      filters: {
        categories: categories.map(c => c.category),
      },
    });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
} 