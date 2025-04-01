import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get total orders
    const totalOrders = await prisma.order.count();
    
    // For this example, we're assuming one tree per order
    const treesPlanted = totalOrders;
    
    // Calculate carbon offset (example calculation)
    const carbonOffset = Math.floor(treesPlanted * 0.06); // Average tree offsets 0.06 tonnes CO2 per year

    return NextResponse.json({
      totalOrders,
      treesPlanted,
      carbonOffset,
    });
  } catch (error) {
    console.error('Error fetching eco stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch eco stats' },
      { status: 500 }
    );
  }
} 