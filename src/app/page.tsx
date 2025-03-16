import Image from "next/image";
import Link from "next/link";
import { artworks, heroImage } from './data/artworks';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <Image
          src={heroImage}
          alt="Art Gallery Hero"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Welcome to Art Realm</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">Discover unique artworks from talented artists around the world</p>
            <Link
              href="/artwork"
              className="bg-white/90 text-black px-8 py-4 rounded-md hover:bg-white transition-all text-lg font-medium hover:scale-105 inline-block"
            >
              Explore Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Artworks */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Artworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork) => (
            <Link href={`/artwork/${artwork.id}`} key={artwork.id}>
              <div className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{artwork.title}</h3>
                <p className="text-gray-200">{artwork.artist}</p>
                <p className="mt-1 font-medium text-white">${artwork.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
