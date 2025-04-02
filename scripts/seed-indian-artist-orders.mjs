import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Order statuses we want to use
const ORDER_STATUSES = ['pending', 'completed', 'shipping', 'cancelled'];

// Indian artists we added previously
const INDIAN_ARTISTS = ['Priya Sharma', 'Raj Patel', 'Ananya Krishnan'];

async function main() {
  try {
    console.log('Starting to seed orders for Indian artists...');
    
    // Get artworks by Indian artists
    const indianArtistsIds = [];
    
    for (const artistName of INDIAN_ARTISTS) {
      const artist = await prisma.user.findFirst({
        where: {
          name: artistName,
          role: 'ARTIST'
        }
      });
      
      if (artist) {
        indianArtistsIds.push(artist.id);
        console.log(`Found artist ${artistName} with ID: ${artist.id}`);
      } else {
        console.warn(`Artist ${artistName} not found`);
      }
    }
    
    if (indianArtistsIds.length === 0) {
      throw new Error('No Indian artists found');
    }
    
    // Get all artworks by Indian artists
    const artworks = await prisma.artwork.findMany({
      where: {
        artistId: {
          in: indianArtistsIds
        }
      }
    });
    
    if (artworks.length === 0) {
      throw new Error('No artworks found for Indian artists');
    }
    
    console.log(`Found ${artworks.length} artworks by Indian artists`);
    
    // Get all buyers in the system
    const buyers = await prisma.user.findMany({
      where: {
        role: 'BUYER'
      }
    });
    
    if (buyers.length === 0) {
      throw new Error('No buyers found');
    }
    
    console.log(`Found ${buyers.length} buyers to create orders`);
    
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
    
    // Make sure each artwork has at least one order
    for (const artwork of artworks) {
      // Get a random buyer
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      
      // Create order with random date in the last 3 months
      const orderDate = new Date();
      orderDate.setMonth(orderDate.getMonth() - Math.floor(Math.random() * 3));
      
      // Set a random status (bias toward completed)
      let status;
      const rand = Math.random();
      if (rand < 0.5) {
        status = 'completed';
      } else if (rand < 0.7) {
        status = 'shipping';
      } else if (rand < 0.9) {
        status = 'pending';
      } else {
        status = 'cancelled';
      }
      
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
    
    // Add some additional random orders
    const extraOrderCount = 5;
    
    for (let i = 0; i < extraOrderCount; i++) {
      // Get a random artwork
      const artwork = artworks[Math.floor(Math.random() * artworks.length)];
      
      // Get a random buyer
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      
      // Create order with random date in the last 6 months
      const orderDate = new Date();
      orderDate.setMonth(orderDate.getMonth() - Math.floor(Math.random() * 6));
      
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
    
    // Wait for all orders to be created
    const createdOrders = await Promise.all(orderPromises);
    
    console.log(`Created ${createdOrders.length} demo orders`);
    
    // Generate order statistics
    const ordersByStatus = {};
    const ordersByArtist = {};
    
    for (const order of createdOrders) {
      // Count by status
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
      
      // Find the artwork to get the artist
      const artwork = artworks.find(a => a.id === order.artworkId);
      if (artwork) {
        ordersByArtist[artwork.artistId] = (ordersByArtist[artwork.artistId] || 0) + 1;
      }
    }
    
    console.log('Order statistics by status:');
    for (const [status, count] of Object.entries(ordersByStatus)) {
      console.log(`- ${status}: ${count} orders`);
    }
    
    console.log('Order statistics by artist:');
    for (const [artistId, count] of Object.entries(ordersByArtist)) {
      // Get artist name for readability
      const artist = await prisma.user.findUnique({
        where: { id: artistId }
      });
      console.log(`- ${artist ? artist.name : artistId}: ${count} orders`);
    }
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 