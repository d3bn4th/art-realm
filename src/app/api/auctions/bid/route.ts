import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to place a bid' },
        { status: 401 }
      );
    }
    
    const { auctionId, amount } = await req.json();
    
    if (!auctionId || !amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Get the auction to check if it's still active
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { bids: { orderBy: { amount: 'desc' }, take: 1 } }
    });
    
    if (!auction) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      );
    }
    
    if (auction.status !== 'active') {
      return NextResponse.json(
        { error: 'This auction is no longer active' },
        { status: 400 }
      );
    }
    
    if (auction.endTime < new Date()) {
      // Update auction status if it has ended
      await prisma.auction.update({
        where: { id: auctionId },
        data: { status: 'ended' }
      });
      
      return NextResponse.json(
        { error: 'This auction has ended' },
        { status: 400 }
      );
    }
    
    // Check if the bid amount is higher than current price
    if (amount <= auction.currentPrice) {
      return NextResponse.json(
        { error: 'Bid amount must be higher than the current price' },
        { status: 400 }
      );
    }
    
    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        amount,
        bidder: { connect: { id: session.user.id } },
        auction: { connect: { id: auctionId } }
      },
      include: {
        bidder: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Update the auction's current price
    await prisma.auction.update({
      where: { id: auctionId },
      data: { currentPrice: amount }
    });
    
    return NextResponse.json(bid);
  } catch (error) {
    console.error('Error placing bid:', error);
    return NextResponse.json(
      { error: 'Failed to place bid' },
      { status: 500 }
    );
  }
} 