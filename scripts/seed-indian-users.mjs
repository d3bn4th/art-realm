import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Define Indian artists
const indianArtists = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    bio: 'Contemporary artist from Mumbai specializing in vibrant abstract paintings that blend traditional Indian motifs with modern expressionism. Her work has been exhibited across major galleries in India and abroad.',
    location: 'Mumbai, India',
    specialties: ['Abstract Art', 'Contemporary Indian Art', 'Mixed Media'],
    image: '/images/profiles/sarah.jpg' // Reusing existing profile image
  },
  {
    name: 'Raj Patel',
    email: 'raj.patel@example.com',
    bio: 'Traditional artist from Gujarat who creates intricate miniature paintings inspired by historical Mughal and Rajasthani styles. His meticulous attention to detail and use of natural pigments celebrates India\'s rich artistic heritage.',
    location: 'Ahmedabad, India',
    specialties: ['Miniature Painting', 'Traditional Art', 'Heritage Art'],
    image: '/images/profiles/john.jpg' // Reusing existing profile image
  },
  {
    name: 'Ananya Krishnan',
    email: 'ananya.krishnan@example.com',
    bio: 'Sculptor and installation artist from Kerala whose work explores the intersection of tradition and modernity. Her sculptures often incorporate sustainable materials and address environmental themes while drawing from classical Indian aesthetics.',
    location: 'Kochi, India',
    specialties: ['Sculpture', 'Installation Art', 'Sustainable Art'],
    image: '/images/profiles/frida.jpg' // Reusing existing profile image
  }
];

// Define Indian buyers
const indianBuyers = [
  {
    name: 'Vikram Mehta',
    email: 'vikram.mehta@example.com',
    location: 'Delhi, India',
    image: '/images/profiles/vincent.jpg' // Reusing existing profile image
  },
  {
    name: 'Sunita Reddy',
    email: 'sunita.reddy@example.com',
    location: 'Hyderabad, India',
    image: '/images/profiles/sarah.jpg' // Reusing existing profile image
  },
  {
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    location: 'Jaipur, India',
    image: '/images/profiles/john.jpg' // Reusing existing profile image
  }
];

async function main() {
  try {
    console.log('Starting to seed Indian users...');
    
    // Create artists
    for (const artistData of indianArtists) {
      // Check if artist already exists
      const existingArtist = await prisma.user.findUnique({
        where: {
          email: artistData.email
        }
      });
      
      if (existingArtist) {
        console.log(`Artist ${artistData.name} already exists, skipping...`);
        continue;
      }
      
      const artist = await prisma.user.create({
        data: {
          ...artistData,
          password: await bcrypt.hash('password123', 10),
          role: UserRole.ARTIST,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      console.log(`Created artist: ${artist.name}`);
    }
    
    // Create buyers
    for (const buyerData of indianBuyers) {
      // Check if buyer already exists
      const existingBuyer = await prisma.user.findUnique({
        where: {
          email: buyerData.email
        }
      });
      
      if (existingBuyer) {
        console.log(`Buyer ${buyerData.name} already exists, skipping...`);
        continue;
      }
      
      const buyer = await prisma.user.create({
        data: {
          ...buyerData,
          password: await bcrypt.hash('password123', 10),
          role: UserRole.BUYER,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      console.log(`Created buyer: ${buyer.name}`);
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