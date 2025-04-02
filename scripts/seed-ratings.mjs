import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to seed artwork ratings...');
    
    // Find all artworks
    const artworks = await prisma.artwork.findMany();
    
    if (artworks.length === 0) {
      throw new Error('No artworks found in the database');
    }
    
    console.log(`Found ${artworks.length} artworks to seed ratings for`);
    
    // Find all users with BUYER role
    const buyers = await prisma.user.findMany({
      where: {
        role: 'BUYER'
      }
    });
    
    if (buyers.length === 0) {
      throw new Error('No buyers found in the database');
    }
    
    console.log(`Found ${buyers.length} buyers to create ratings`);
    
    // Track ratings created
    let ratingCount = 0;
    
    // For each artwork, create 1-5 random ratings from random users
    for (const artwork of artworks) {
      // Determine how many ratings this artwork will have (1-5)
      const numRatings = 1 + Math.floor(Math.random() * 5);
      
      // Shuffle the buyers array and take the first numRatings buyers
      const shuffledBuyers = [...buyers].sort(() => 0.5 - Math.random());
      const selectedBuyers = shuffledBuyers.slice(0, numRatings);
      
      for (const buyer of selectedBuyers) {
        // Generate a random rating value between 3 and 5 (slightly biased toward positive)
        const ratingValue = 3 + Math.floor(Math.random() * 3);
        
        try {
          // Check if this user has already rated this artwork
          const existingRating = await prisma.rating.findUnique({
            where: {
              userId_artworkId: {
                userId: buyer.id,
                artworkId: artwork.id
              }
            }
          });
          
          if (existingRating) {
            // Update existing rating
            await prisma.rating.update({
              where: {
                id: existingRating.id
              },
              data: {
                value: ratingValue
              }
            });
          } else {
            // Create new rating
            await prisma.rating.create({
              data: {
                value: ratingValue,
                userId: buyer.id,
                artworkId: artwork.id
              }
            });
          }
          
          ratingCount++;
        } catch (error) {
          console.error(`Error creating rating for artwork ${artwork.id} by user ${buyer.id}:`, error);
        }
      }
    }
    
    console.log(`Successfully created/updated ${ratingCount} ratings`);
    
  } catch (error) {
    console.error('Error seeding ratings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 