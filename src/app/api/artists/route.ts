import { NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const artists = await prisma.user.findMany({
      where: {
        role: UserRole.ARTIST
      },
      select: {
        id: true,
        name: true,
        bio: true,
        specialties: true,
        location: true,
        _count: {
          select: {
            artworks: true
          }
        }
      }
    });

    return NextResponse.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 