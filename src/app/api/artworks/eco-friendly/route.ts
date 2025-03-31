import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      where: {
        isEcoFriendly: true
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(artworks);
  } catch (error) {
    console.error('Error fetching eco-friendly artworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch eco-friendly artworks' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 