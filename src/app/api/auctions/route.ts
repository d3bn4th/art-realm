import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all active auctions with their associated artwork and artist info
    const auctions = await prisma.auction.findMany({
      where: {
        status: 'active',
      },
      include: {
        artwork: {
          include: {
            artist: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        bids: {
          orderBy: {
            amount: 'desc',
          },
          take: 5,
          include: {
            bidder: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        endTime: 'asc',
      },
    });

    return NextResponse.json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch auctions' },
      { status: 500 }
    );
  }
} 