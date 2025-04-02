import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Order statuses we want to use
const ORDER_STATUSES = ['pending', 'completed', 'shipping', 'cancelled'];

async function main() {
  try {
    console.log('Starting to seed demo orders...');
    
    // Get Lalith Rahul's ID
    const lalithRahul = await prisma.user.findFirst({
      where: {
        name: 'Lalith Rahul',
        role: 'ARTIST'
      }
    });
    
    if (!lalithRahul) {
      throw new Error('Lalith Rahul artist not found');
    }
    
    console.log(`Found artist Lalith Rahul with ID: ${lalithRahul.id}`);
    
    // Get artworks by Lalith Rahul
    const artworks = await prisma.artwork.findMany({
      where: {
        artistId: lalithRahul.id
      },
      take: 10, // Only use 10 artworks for orders
    });
    
    if (artworks.length === 0) {
      throw new Error('No artworks found for Lalith Rahul');
    }
    
    console.log(`Found ${artworks.length} artworks by Lalith Rahul`);
    
    // Get Indian buyers
    const buyers = await prisma.user.findMany({
      where: {
        role: 'BUYER',
        location: {
          contains: 'India'
        }
      }
    });
    
    // Also include other buyers in the system
    const otherBuyers = await prisma.user.findMany({
      where: {
        role: 'BUYER',
        location: {
          not: {
            contains: 'India'
          }
        }
      },
      take: 2
    });
    
    const allBuyers = [...buyers, ...otherBuyers];
    
    if (allBuyers.length === 0) {
      throw new Error('No buyers found');
    }
    
    console.log(`Found ${allBuyers.length} buyers to create orders`);
    
    // Delete existing orders for these artworks to avoid conflicts
    const existingOrders = await prisma.order.findMany({
      where: {
        artworkId: {
          in: artworks.map(a => a.id)
        }
      }
    });
    
    if (existingOrders.length > 0) {
      console.log(`Deleting ${existingOrders.length} existing orders...`);
      await prisma.order.deleteMany({
        where: {
          id: {
            in: existingOrders.map(o => o.id)
          }
        }
      });
    }
    
    // Create demo orders
    const orderPromises = [];
    
    // Each buyer orders 1-2 artworks
    for (const buyer of allBuyers) {
      // Determine how many artworks this buyer will purchase (1-2)
      const orderCount = Math.min(1 + Math.floor(Math.random() * 2), artworks.length);
      
      // Get random artworks for this buyer
      const buyerArtworks = getRandomElements(artworks, orderCount);
      
      for (const artwork of buyerArtworks) {
        // Create orders with random dates in the last 3 months
        const orderDate = new Date();
        orderDate.setMonth(orderDate.getMonth() - Math.floor(Math.random() * 3));
        
        // Set a random status
        const status = ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)];
        
        // Create the order
        const orderPromise = prisma.order.create({
          data: {
            status,
            totalAmount: artwork.price,
            buyerId: buyer.id,
            artworkId: artwork.id,
            createdAt: orderDate,
            updatedAt: orderDate,
          }
        });
        
        orderPromises.push(orderPromise);
      }
    }
    
    // Wait for all orders to be created
    const createdOrders = await Promise.all(orderPromises);
    
    console.log(`Created ${createdOrders.length} demo orders`);
    
    // Generate order statistics
    const ordersByStatus = {};
    for (const order of createdOrders) {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    }
    
    console.log('Order statistics by status:');
    for (const [status, count] of Object.entries(ordersByStatus)) {
      console.log(`- ${status}: ${count} orders`);
    }
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to get random elements from an array
function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 