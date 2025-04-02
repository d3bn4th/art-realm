import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Define artwork images with consistent naming
const artworkImages = {
  'Starry Night': '/images/artworks/starry-night.jpg',
  'Self Portrait with Thorn Necklace': '/images/artworks/self-portrait.jpg',
  'Ocean Plastic Dreams': '/images/artworks/ocean-plastic.jpg',
  'Forest Rebirth': '/images/artworks/forest-rebirth.jpg',
  'Solar Winds': '/images/artworks/solar-winds.jpg',
  'Biodegradable Beauty': '/images/artworks/biodegradable-beauty.jpg',
  'Digital Forest Symphony': '/images/artworks/digital-forest.jpg',
  'Upcycled Dreams': '/images/artworks/upcycled-dreams.jpg',
  "Nature's Palette": '/images/artworks/natures-palette.jpg',
  'Sustainable Horizons': '/images/artworks/sustainable-horizons.jpg',
  "Twin Birds" : '/images/artworks/twin-birds.jpg'
};

// Define user profile images
const userImages = {
  vincent: '/images/profiles/vincent.jpg',
  frida: '/images/profiles/frida.jpg',
  john: '/images/profiles/john.jpg',
  sarah: '/images/profiles/sarah.jpg',
  rahul: '/images/profiles/rahul.jpg'
};

async function main() {
  // Clean existing data
  await prisma.order.deleteMany();
  await prisma.artwork.deleteMany();
  await prisma.user.deleteMany();

  // Create sample artists
  const artist1 = await prisma.user.create({
    data: {
      email: 'vincent@example.com',
      name: 'Vincent van Gogh',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.ARTIST,
      bio: 'Post-impressionist painter known for bold colors and expressive style',
      location: 'Netherlands',
      specialties: ['Oil Painting', 'Post-impressionism'],
      image: userImages.vincent,
    },
  });

  const artist2 = await prisma.user.create({
    data: {
      email: 'frida@example.com',
      name: 'Frida Kahlo',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.ARTIST,
      bio: 'Mexican artist known for self-portraits and works inspired by nature',
      location: 'Mexico',
      specialties: ['Self Portraits', 'Surrealism'],
      image: userImages.frida,
    },
  });

  const artist3 = await prisma.user.create({
    data: {
      email: 'rahul@example.com',
      name: 'Lalith Rahul',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.ARTIST,
      bio: 'Indian Artists creating awe inspiring artwords of religious figures',
      location: 'India',
      specialties: ['Paitings', 'Sketches', 'Sculptures'],
      image: userImages.frida,
    },
  });
  

  // Create sample buyers
  const buyer1 = await prisma.user.create({
    data: {
      email: 'art.collector@example.com',
      name: 'John Collector',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.BUYER,
      location: 'New York',
      image: userImages.john,
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      email: 'sarah.art@example.com',
      name: 'Sarah Mitchell',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.BUYER,
      location: 'London',
      image: userImages.sarah,
    },
  });

  // Create sample artworks
  const artwork1 = await prisma.artwork.create({
    data: {
      title: 'Starry Night',
      description: 'A stunning night sky scene with swirling clouds and bright stars',
      price: 1000000,
      category: 'Painting',
      image: artworkImages['Starry Night'],
      isEcoFriendly: true,
      materials: ['Oil Paint', 'Canvas'],
      artistId: artist1.id,
    },
  });

  const artwork2 = await prisma.artwork.create({
    data: {
      title: 'Self Portrait with Thorn Necklace',
      description: 'A self-portrait featuring symbolic elements and vibrant colors',
      price: 750000,
      category: 'Painting',
      image: artworkImages['Self Portrait with Thorn Necklace'],
      isEcoFriendly: true,
      materials: ['Oil Paint', 'Canvas'],
      artistId: artist2.id,
    },
  });

  // Add eco-friendly artworks
  const artwork3 = await prisma.artwork.create({
    data: {
      title: 'Ocean Plastic Dreams',
      description: 'A stunning sculpture made entirely from recycled ocean plastic, highlighting marine conservation',
      price: 450000,
      category: 'Sculpture',
      image: artworkImages['Ocean Plastic Dreams'],
      isEcoFriendly: true,
      materials: ['Recycled Ocean Plastic', 'LED Lights'],
      artistId: artist1.id,
    },
  });

  const artwork4 = await prisma.artwork.create({
    data: {
      title: 'Forest Rebirth',
      description: 'Mixed media artwork using fallen leaves, reclaimed wood, and natural pigments',
      price: 320000,
      category: 'Mixed Media',
      image: artworkImages['Forest Rebirth'],
      isEcoFriendly: true,
      materials: ['Reclaimed Wood', 'Natural Pigments', 'Fallen Leaves'],
      artistId: artist2.id,
    },
  });

  const artwork5 = await prisma.artwork.create({
    data: {
      title: 'Solar Winds',
      description: 'Interactive sculpture powered by solar energy, creating dynamic light patterns',
      price: 890000,
      category: 'Sculpture',
      image: artworkImages['Solar Winds'],
      isEcoFriendly: true,
      materials: ['Recycled Metal', 'Solar Panels', 'LED Lights'],
      artistId: artist1.id,
    },
  });

  const artwork6 = await prisma.artwork.create({
    data: {
      title: 'Biodegradable Beauty',
      description: 'Temporary installation made entirely from biodegradable materials',
      price: 280000,
      category: 'Installation',
      image: artworkImages['Biodegradable Beauty'],
      isEcoFriendly: true,
      materials: ['Bamboo', 'Hemp Fiber', 'Natural Dyes'],
      artistId: artist2.id,
    },
  });

  // Add new artworks
  const artwork7 = await prisma.artwork.create({
    data: {
      title: 'Digital Forest Symphony',
      description: 'An immersive digital artwork exploring the harmony of nature through sustainable technology',
      price: 420000,
      category: 'Digital Art',
      image: artworkImages['Digital Forest Symphony'],
      isEcoFriendly: true,
      materials: ['Recycled Electronics', 'Solar Panels', 'LED Display'],
      artistId: artist1.id,
    },
  });

  const artwork8 = await prisma.artwork.create({
    data: {
      title: 'Upcycled Dreams',
      description: 'A mesmerizing sculpture crafted entirely from upcycled industrial materials',
      price: 550000,
      category: 'Sculpture',
      image: artworkImages['Upcycled Dreams'],
      isEcoFriendly: true,
      materials: ['Recycled Metal', 'Salvaged Glass', 'Repurposed Industrial Parts'],
      artistId: artist2.id,
    },
  });

  const artwork9 = await prisma.artwork.create({
    data: {
      title: "Nature's Palette",
      description: 'A vibrant painting using only natural and organic pigments',
      price: 680000,
      category: 'Painting',
      image: artworkImages["Nature's Palette"],
      isEcoFriendly: true,
      materials: ['Natural Pigments', 'Organic Canvas', 'Plant-based Binders'],
      artistId: artist1.id,
    },
  });

  const artwork10 = await prisma.artwork.create({
    data: {
      title: 'Sustainable Horizons',
      description: 'A large-scale installation highlighting renewable energy through art',
      price: 920000,
      category: 'Installation',
      image: artworkImages['Sustainable Horizons'],
      isEcoFriendly: true,
      materials: ['Wind Turbine Parts', 'Solar Cells', 'Recycled Materials'],
      artistId: artist2.id,
    },
  });
  const artwork11 = await prisma.artwork.create({
    data: {
      title: 'Twin Birds',
      description: 'The bloody moon night shared between two birds',
      price: 920000,
      category: 'Installation',
      image: artworkImages['Sustainable Horizons'],
      isEcoFriendly: true,
      materials: ['Recycled Paints and Canvas'],
      artistId: artist3.id,
    },
  });

  // Create sample orders
  await prisma.order.create({
    data: {
      status: 'completed',
      totalAmount: 500000,
      buyerId: buyer1.id,
      artworkId: artwork1.id,
    },
  });

  await prisma.order.create({
    data: {
      status: 'pending',
      totalAmount: 750000,
      buyerId: buyer1.id,
      artworkId: artwork2.id,
    },
  });

  // Add orders for eco-friendly artworks
  await prisma.order.create({
    data: {
      status: 'completed',
      totalAmount: 450000,
      buyerId: buyer2.id,
      artworkId: artwork3.id,
    },
  });

  await prisma.order.create({
    data: {
      status: 'pending',
      totalAmount: 320000,
      buyerId: buyer2.id,
      artworkId: artwork4.id,
    },
  });

  await prisma.order.create({
    data: {
      status: 'completed',
      totalAmount: 890000,
      buyerId: buyer1.id,
      artworkId: artwork5.id,
    },
  });

  await prisma.order.create({
    data: {
      status: 'pending',
      totalAmount: 280000,
      buyerId: buyer1.id,
      artworkId: artwork6.id,
    },
  });

  // Create orders for new artworks
  await prisma.order.create({
    data: {
      status: 'pending',
      totalAmount: 420000,
      buyerId: buyer1.id,
      artworkId: artwork7.id,
    },
  });

  await prisma.order.create({
    data: {
      status: 'completed',
      totalAmount: 550000,
      buyerId: buyer2.id,
      artworkId: artwork8.id,
    },
  });

  await prisma.order.create({
    data: {
      status: 'pending',
      totalAmount: 680000,
      buyerId: buyer1.id,
      artworkId: artwork9.id,
    },
  });

  await prisma.order.create({
    data: {
      status: 'completed',
      totalAmount: 920000,
      buyerId: buyer2.id,
      artworkId: artwork10.id,
    },
  });
  await prisma.order.create({
    data: {
      status: 'completed',
      totalAmount: 920000,
      buyerId: buyer2.id,
      artworkId: artwork11.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 