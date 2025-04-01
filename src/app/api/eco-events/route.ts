import { NextResponse } from 'next/server';

export async function GET() {
  // Example events data
  const events = [
    {
      id: '1',
      title: 'Sustainable Art Workshop',
      date: 'June 15, 2024',
      location: 'Chhobi-o-Ghor Art Gallery, Hindustan Park, Keyatala, Kolkata, West Bengal',
      description: 'Learn how to create beautiful art using sustainable materials.',
      image: '/images/events/workshop.jpg',
    },
    {
      id: '2',
      title: 'Eco-Art Exhibition',
      date: 'July 1, 2024',
      location: 'New York, NY',
      description: 'Showcasing artwork made from recycled materials.',
      image: '/images/events/exhibition.jpg',
    },
    {
      id: '3',
      title: 'Green Artists Summit',
      date: 'August 20, 2024',
      location: 'Virtual Event',
      description: 'Connect with eco-conscious artists from around the world.',
      image: '/images/events/summit.jpg',
    },
  ];

  return NextResponse.json(events);
} 