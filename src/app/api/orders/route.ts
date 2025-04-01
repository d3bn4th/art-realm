import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { items, shipping, tax, total, shippingAddress, paymentMethod } = data;

    if (!items || !items.length || !shippingAddress) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // First, verify if all artwork items exist and are available
    const artworkIds = items.map((item: any) => item.id);
    const artworks = await prisma.artwork.findMany({
      where: {
        id: { in: artworkIds }
      }
    });

    if (artworks.length !== artworkIds.length) {
      return NextResponse.json({ error: 'One or more artworks not found' }, { status: 400 });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        status: 'pending',
        totalAmount: total,
        buyerId: session.user.id,
        artworkId: items[0].id, // Current schema only supports one artwork per order
        // In a real app, you'd want to create OrderItems with a many-to-many relationship
      }
    });

    return NextResponse.json({ 
      id: order.id,
      status: order.status,
      createdAt: order.createdAt
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Only allow users to view their own orders, unless they're an admin (feature to be added)
    if (userId && userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      where: {
        buyerId: session.user.id
      },
      include: {
        artwork: {
          select: {
            id: true,
            title: true,
            image: true,
            price: true,
            artist: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 