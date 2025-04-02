'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface EcoStats {
  totalOrders: number;
  treesPlanted: number;
  carbonOffset: number;
}

interface EcoEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

export default function EcoInitiatives() {
  const [ecoStats, setEcoStats] = useState<EcoStats>({
    totalOrders: 0,
    treesPlanted: 0,
    carbonOffset: 0,
  });
  const [events, setEvents] = useState<EcoEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEcoData = async () => {
      try {
        // Fetch eco stats from your API
        const statsResponse = await fetch('/api/eco-stats');
        const statsData = await statsResponse.json();
        setEcoStats(statsData);

        // Fetch eco events from your API
        const eventsResponse = await fetch('/api/eco-events');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching eco data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEcoData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-green-900"
      >
        <div className="absolute inset-0 bg-[url('/images/eco-hero.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Our Eco Initiatives
          </h1>
          <p className="text-xl md:text-2xl text-green-100">
            Making art sustainable, one tree at a time
          </p>
        </div>
      </motion.div>

      {/* Impact Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="py-16 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
            Our Environmental Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {ecoStats.totalOrders}
              </div>
              <div className="text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {ecoStats.treesPlanted}
              </div>
              <div className="text-gray-600">Trees Planted</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {ecoStats.carbonOffset}t
              </div>
              <div className="text-gray-600">Carbon Offset</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Carbon Footprint Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="py-16 px-4 bg-green-900 text-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Carbon Footprint
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Committed to Carbon Neutrality
              </h3>
              <p className="text-green-100 mb-6">
                We &apos re dedicated to reducing our environmental impact through sustainable practices
                and carbon offset initiatives. Our goal is to achieve carbon neutrality by 2025.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg
                    className="h-6 w-6 text-green-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  100% Renewable Energy in Our Operations
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-6 w-6 text-green-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Eco-Friendly Packaging Solutions
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-6 w-6 text-green-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Carbon Offset Shipping Partners
                </li>
              </ul>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/images/carbon-neutral.png"
                alt="Carbon Neutral Illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Eco Events Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="py-16 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
            Upcoming Eco-Friendly Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-green-800">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{event.date}</span>
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
} 