import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getRandomPrice(min: number, max: number): Promise<number> {
  // Generate a random price between min and max, rounded to nearest hundred
  return Math.round((Math.random() * (max - min) + min) / 100) * 100;
}

async function updateArtworkPrices() {
  try {
    // Get all artworks
    const artworks = await prisma.artwork.findMany();
    
    console.log(`Found ${artworks.length} artworks. Updating prices...`);
    
    // Update each artwork with a price between 1000 and 5000
    for (const artwork of artworks) {
      const newPrice = await getRandomPrice(1000, 5000);
      
      await prisma.artwork.update({
        where: { id: artwork.id },
        data: { price: newPrice }
      });
      
      console.log(`Updated artwork "${artwork.title}" price: ${artwork.price} → ${newPrice}`);
    }
    
    console.log('All artwork prices have been updated successfully!');
  } catch (error) {
    console.error('Error updating artwork prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the price update function
updateArtworkPrices(); 