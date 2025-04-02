import { PrismaClient } from '@prisma/client';
import { add } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to seed auctions...');
    
    // Get some existing artworks to put up for auction
    const artworks = await prisma.artwork.findMany({
      take: 6,
      where: {
        auction: null, // Only get artworks not already in auction
      },
      include: {
        artist: true,
      },
    });
    
    if (artworks.length === 0) {
      console.log('No available artworks found for auctions');
      return;
    }
    
    console.log(`Found ${artworks.length} artworks available for auction`);
    
    // Create auctions for these artworks
    for (const artwork of artworks) {
      // Calculate auction times
      const now = new Date();
      
      // Some auctions ending soon, some ending in a few days
      const duration = Math.random() > 0.5 
        ? { hours: Math.floor(Math.random() * 6) + 1 } // 1-6 hours
        : { days: Math.floor(Math.random() * 7) + 1 };  // 1-7 days
      
      const startTime = add(now, { hours: -Math.floor(Math.random() * 48) }); // Started 0-48 hours ago
      const endTime = add(now, duration);
      
      // Create starting price at 40-80% of the artwork's price
      const startingPercentage = 0.4 + (Math.random() * 0.4); // 40-80%
      const startingPrice = Math.round(artwork.price * startingPercentage);
      
      // Create current price between starting price and artwork price
      const currentPricePercentage = startingPercentage + (Math.random() * (0.95 - startingPercentage));
      const currentPrice = Math.round(artwork.price * currentPricePercentage);
      
      // Create the auction
      const auction = await prisma.auction.create({
        data: {
          startTime,
          endTime,
          startingPrice,
          currentPrice,
          status: 'active',
          artwork: {
            connect: {
              id: artwork.id,
            },
          },
        },
      });
      
      console.log(`Created auction for "${artwork.title}" ending ${endTime.toLocaleString()}`);
      
      // Get some random users to create bids (as BUYER users)
      const users = await prisma.user.findMany({
        where: { role: 'BUYER' },
        take: 5,
      });
      
      if (users.length > 0) {
        // Create some bids for this auction
        const numBids = Math.floor(Math.random() * 8); // 0-7 bids
        let lastBidAmount = startingPrice;
        
        for (let i = 0; i < numBids; i++) {
          // Increment by 2-8% each bid
          const incrementPercentage = 1 + (0.02 + Math.random() * 0.06);
          const bidAmount = Math.round(lastBidAmount * incrementPercentage);
          
          // Don't exceed the current price
          if (bidAmount > currentPrice) break;
          
          const bidUser = users[Math.floor(Math.random() * users.length)];
          
          await prisma.bid.create({
            data: {
              amount: bidAmount,
              bidder: {
                connect: {
                  id: bidUser.id,
                },
              },
              auction: {
                connect: {
                  id: auction.id,
                },
              },
            },
          });
          
          lastBidAmount = bidAmount;
        }
        
        console.log(`Created ${numBids} bids for this auction`);
      }
    }
    
    console.log('Auction seeding completed successfully!');
  } catch (error) {
    console.error('Error during auction seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 