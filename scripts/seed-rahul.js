import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const prisma = new PrismaClient();

const artTitles = [
  "Divine Radiance of Lord Narasimha",
  "Cosmic Dance of Shiva",
  "Serenity of Lord Krishna",
  "The Sacred Gaze",
  "Divine Mother's Blessing",
  "Eternal Union of Radha Krishna",
  "The Celestial Vision",
  "Spiritual Awakening",
  "Divine Harmony",
  "Devotional Ecstasy",
  "Sacred Meditation",
  "Divine Light",
  "Mystic Connection",
  "Transcendental Beauty",
  "Spiritual Enlightenment",
  "Divine Communion",
  "Sacred Transformation",
  "Cosmic Consciousness",
  "Eternal Devotion",
  "Divine Grace"
];

const artDescriptions = [
  "A powerful depiction of Lord Narasimha, the half-man half-lion avatar of Vishnu, showcasing divine protection and the triumph of good over evil.",
  "This artwork captures the cosmic dance of Lord Shiva, symbolizing the cycles of creation and destruction in the universe.",
  "A serene portrayal of Lord Krishna playing his flute, representing divine harmony and spiritual connection.",
  "This piece depicts the intense and sacred gaze of divinity that transcends worldly existence.",
  "A tender portrayal of the Divine Mother bestowing her blessings upon humanity.",
  "This artwork celebrates the eternal union of Radha and Krishna, symbolizing the perfect divine love.",
  "A visionary depiction of celestial beings and divine realms beyond ordinary perception.",
  "This piece captures the moment of spiritual awakening and enlightenment.",
  "An exploration of the harmony between various divine aspects in Hindu spirituality.",
  "This artwork depicts the ecstatic state of devotional surrender.",
  "A powerful representation of deep meditative connection with the divine.",
  "This piece explores the transformative power of divine light and consciousness.",
  "An illustration of the mystic connection between the human and divine realms.",
  "This artwork celebrates the transcendental beauty of divine entities.",
  "A depiction of the path to spiritual enlightenment through devotion.",
  "This piece represents the sacred communion between devotee and deity.",
  "An exploration of spiritual transformation through divine grace.",
  "This artwork delves into the expansion of consciousness to cosmic levels.",
  "A celebration of eternal devotion and surrender to divine will.",
  "This piece depicts the flow of divine grace that uplifts and transforms."
];

const categories = ["Spiritual Art", "Religious Art", "Traditional Painting", "Sacred Art", "Devotional Art"];
const materials = [
  ["Acrylic on Canvas", "Gold Leaf"],
  ["Oil on Canvas", "Natural Pigments"],
  ["Mixed Media", "Handmade Paper"],
  ["Tempera", "Traditional Pigments"],
  ["Watercolor", "Handcrafted Canvas"]
];

async function main() {
  try {
    console.log('Starting to seed Lalith Rahul and artworks...');
    
    // Check if artist already exists
    const existingArtist = await prisma.user.findFirst({
      where: {
        name: 'Lalith Rahul',
        role: UserRole.ARTIST
      }
    });
    
    let artist;
    
    if (existingArtist) {
      console.log('Artist Lalith Rahul already exists, using existing artist...');
      artist = existingArtist;
    } else {
      // Create Lalith Rahul artist
      artist = await prisma.user.create({
        data: {
          email: 'lalith.rahul@example.com',
          name: 'Lalith Rahul',
          password: await bcrypt.hash('password123', 10),
          role: UserRole.ARTIST,
          bio: 'Lalith Rahul is a renowned Indian artist specializing in spiritual and religious art. His work beautifully captures the essence of Hindu deities and sacred concepts, blending traditional techniques with contemporary expressions. Each piece reflects his deep spiritual connection and dedication to preserving cultural heritage through art.',
          location: 'India',
          specialties: ['Religious Art', 'Divine Portraits', 'Traditional Indian Art', 'Spiritual Imagery'],
          image: '/images/profiles/rahul.jpg',
        },
      });
      console.log('Created artist:', artist.name);
    }
    
    // Read artworks directory
    const artworksDir = path.join(projectRoot, 'public', 'images', 'artworks', 'rahul');
    const files = fs.readdirSync(artworksDir);
    
    console.log(`Found ${files.length} image files`);
    
    // Check for existing artworks to avoid duplicates
    const existingArtworkImages = await prisma.artwork.findMany({
      where: {
        artistId: artist.id
      },
      select: {
        image: true
      }
    });
    
    const existingImagePaths = existingArtworkImages.map(a => a.image);
    
    // Create artwork for each image
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imagePath = `/images/artworks/rahul/${file}`;
      
      // Skip if artwork with this image already exists
      if (existingImagePaths.includes(imagePath)) {
        console.log(`Skipping existing artwork: ${imagePath}`);
        continue;
      }
      
      // Generate random price between 50000 and 150000
      const price = Math.floor(Math.random() * 100000) + 50000;
      
      // Get title and description (cycle through if more images than titles)
      const titleIndex = i % artTitles.length;
      const descIndex = i % artDescriptions.length;
      
      // Get random category and materials
      const category = categories[Math.floor(Math.random() * categories.length)];
      const materialSet = materials[Math.floor(Math.random() * materials.length)];
      
      const artwork = await prisma.artwork.create({
        data: {
          title: artTitles[titleIndex],
          description: artDescriptions[descIndex],
          price: price,
          category: category,
          image: imagePath,
          isEcoFriendly: Math.random() > 0.5, // 50% chance of being eco-friendly
          materials: materialSet,
          artistId: artist.id,
        },
      });
      
      console.log(`Created artwork: ${artwork.title} - ${imagePath}`);
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