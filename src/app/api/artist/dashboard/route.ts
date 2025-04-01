import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ARTIST') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total artworks count
    const totalArtworks = await prisma.artwork.count({
      where: {
        artistId: session.user.id,
      },
    });

    // Get total sales amount
    const orders = await prisma.order.findMany({
      where: {
        artwork: {
          artistId: session.user.id,
        },
        status: 'completed',
      },
      select: {
        totalAmount: true,
      },
    });

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        artwork: {
          artistId: session.user.id,
        },
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        artwork: {
          select: {
            title: true,
            image: true,
          },
        },
        buyer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // Get recent artworks
    const recentArtworks = await prisma.artwork.findMany({
      where: {
        artistId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        price: true,
        image: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
    });

    // Calculate average rating (mock data for now)
    const averageRating = 4.5;

    return NextResponse.json({
      totalArtworks,
      totalSales,
      averageRating,
      recentOrders: recentOrders.map(order => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
      })),
      recentArtworks: recentArtworks.map(artwork => ({
        ...artwork,
        createdAt: artwork.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 