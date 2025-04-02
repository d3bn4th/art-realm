import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const prisma = new PrismaClient();

// Define artwork titles and descriptions for each artist
const artistArtworks = {
  'Priya Sharma': {
    titles: [
      'Contemporary Divine Fusion',
      'Mystic Abstraction of Krishna',
      'Urban Spirituality',
      'Abstract Devotion',
      'Modern Mythology',
      'Vibrant Connection',
      'Spiritual Rhythm'
    ],
    descriptions: [
      'A vibrant abstract interpretation that blends traditional Indian divine imagery with contemporary urban elements, creating a bridge between ancient spirituality and modern life.',
      'This mixed media artwork explores the concept of divine love through abstract forms and vibrant colors inspired by Radha-Krishna mythology.',
      'An abstract representation of spiritual awakening using bold colors and dynamic brushstrokes that invite viewers into a meditative space.',
      'This artwork reinterprets classical Indian iconography through a contemporary lens, using layers of color and texture to evoke spiritual depth.',
      'A celebration of Indian mythology reimagined through abstract forms and vivid color palettes that speak to both tradition and innovation.'
    ],
    categories: ['Abstract Art', 'Contemporary Art', 'Mixed Media'],
    materials: [
      ['Acrylic Paint', 'Canvas', 'Gold Leaf'],
      ['Oil Paint', 'Recycled Materials', 'Digital Elements'],
      ['Ink', 'Handmade Paper', 'Metal Foil']
    ]
  },
  'Raj Patel': {
    titles: [
      'Heritage in Miniature',
      'Royal Court Scene',
      'Timeless Mughal Garden',
      'Sacred Legends',
      'Divine Tales Retold',
      'Traditional Harmony',
      'Ancient Wisdom'
    ],
    descriptions: [
      'This intricate miniature painting draws from the Mughal tradition, depicting a royal garden scene with meticulous attention to detail using natural pigments and fine brushwork.',
      'A traditional miniature illustration inspired by ancient Indian scriptures, showcasing divine figures with elaborate ornamentation and symbolic elements.',
      'This artwork revives the classical Rajasthani painting style, featuring intricate patterns and vibrant colors that tell stories from Indian mythology.',
      'A detailed miniature depicting everyday life in ancient India, capturing the essence of tradition through elaborate composition and fine detail work.',
      'This piece celebrates the heritage of Indian artistic traditions through careful brushwork and authentic techniques passed down through generations.'
    ],
    categories: ['Traditional Art', 'Miniature Painting', 'Heritage Art'],
    materials: [
      ['Natural Pigments', 'Handmade Paper', 'Gold Leaf'],
      ['Stone Colors', 'Wasli Paper', 'Fine Brushes'],
      ['Traditional Pigments', 'Cotton Paper', 'Shell Gold']
    ]
  },
  'Ananya Krishnan': {
    titles: [
      'Sustainable Divinity',
      'Earth and Spirit',
      'Divine Recycled Form',
      'Nature\'s Divine Balance',
      'Sacred Sustainability',
      'Ecological Worship',
      'Organic Spirituality'
    ],
    descriptions: [
      'A sculptural installation crafted from reclaimed materials that explores the relationship between spirituality and environmental consciousness through divine forms.',
      'This eco-conscious artwork reimagines traditional deities using sustainable materials, symbolizing the sacred relationship between humanity and nature.',
      'A three-dimensional exploration of Indian spiritual iconography using bamboo, recycled metals, and natural fibers, emphasizing harmony with the earth.',
      'This installation merges traditional sculptural techniques with contemporary environmental concerns, creating a dialogue between ancient wisdom and modern sustainability.',
      'A modern interpretation of classical sculptural forms using reclaimed wood and natural materials, celebrating the divine in nature and ecological balance.'
    ],
    categories: ['Sculpture', 'Installation Art', 'Sustainable Art'],
    materials: [
      ['Recycled Metal', 'Bamboo', 'Natural Fibers'],
      ['Reclaimed Wood', 'Clay', 'Organic Pigments'],
      ['Sustainable Textiles', 'Recycled Paper', 'Natural Dyes']
    ]
  }
};

async function getArtistByName(name) {
  return prisma.user.findFirst({
    where: {
      name,
      role: 'ARTIST'
    }
  });
}

async function getAvailableImages() {
  // Get all images from Rahul's artwork directory but only use a subset for each artist
  const artworksDir = path.join(projectRoot, 'public', 'images', 'artworks', 'rahul');
  const files = fs.readdirSync(artworksDir);
  return files.map(file => `/images/artworks/rahul/${file}`);
}

async function createArtworksForArtist(artistName, numArtworks = 5) {
  const artist = await getArtistByName(artistName);
  if (!artist) {
    console.error(`Artist ${artistName} not found`);
    return;
  }
  
  console.log(`Creating artworks for ${artistName} (ID: ${artist.id})`);
  
  // Get artworks data for this artist
  const artworkData = artistArtworks[artistName];
  if (!artworkData) {
    console.error(`No artwork data defined for ${artistName}`);
    return;
  }
  
  // Get images
  const availableImages = await getAvailableImages();
  
  // Check if artist already has artworks to avoid duplicates
  const existingArtworks = await prisma.artwork.findMany({
    where: {
      artistId: artist.id
    },
    select: {
      image: true
    }
  });
  
  const existingImages = existingArtworks.map(a => a.image);
  
  // Use a subset of images for this artist, different ones for each
  const startIndex = Object.keys(artistArtworks).indexOf(artistName) * numArtworks % availableImages.length;
  const artistImages = availableImages.slice(startIndex, startIndex + numArtworks);
  
  // Create artworks
  for (let i = 0; i < Math.min(numArtworks, artistImages.length); i++) {
    const image = artistImages[i];
    
    // Skip if image already used for this artist
    if (existingImages.includes(image)) {
      console.log(`Skipping existing artwork with image: ${image}`);
      continue;
    }
    
    // Generate random price between 50000 and 150000
    const price = Math.floor(Math.random() * 100000) + 50000;
    
    // Get title, description, category, and materials
    const titleIndex = i % artworkData.titles.length;
    const descIndex = i % artworkData.descriptions.length;
    const category = artworkData.categories[i % artworkData.categories.length];
    const materialSet = artworkData.materials[i % artworkData.materials.length];
    
    const artwork = await prisma.artwork.create({
      data: {
        title: artworkData.titles[titleIndex],
        description: artworkData.descriptions[descIndex],
        price: price,
        category: category,
        image: image,
        isEcoFriendly: Math.random() > 0.3, // 70% chance of being eco-friendly
        materials: materialSet,
        artistId: artist.id,
      },
    });
    
    console.log(`Created artwork: ${artwork.title} - ${image} for ${artistName}`);
  }
}

async function main() {
  try {
    console.log('Starting to seed Indian artworks...');
    
    // Create artworks for each Indian artist
    for (const artistName of Object.keys(artistArtworks)) {
      await createArtworksForArtist(artistName, 5); // Create 5 artworks per artist
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