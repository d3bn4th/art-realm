import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getArtworkImagePath } from '@/lib/utils';

async function getArtwork(id: string) {
  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include: {
      artist: true,
      orders: true,
    },
  });
  return artwork;
}

// Update function signature to use type annotation
type PageParams = {
  params: {
    id: string;
  };
};

export default async function ArtworkPage({ params }: PageParams) {
  const artwork = await getArtwork(params.id);

  if (!artwork) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Artwork Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={getArtworkImagePath(artwork.image)}
              alt={artwork.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{artwork.title}</h1>
              <p className="text-xl text-gray-400">by {artwork.artist.name}</p>
            </div>

            {artwork.isEcoFriendly && (
              <Badge variant="secondary" className="bg-green-600 text-white">
                Eco-Friendly
              </Badge>
            )}

            <div>
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-gray-300">{artwork.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">Details</h2>
              <dl className="grid grid-cols-1 gap-3 text-gray-300">
                <div>
                  <dt className="font-medium text-gray-400">Category</dt>
                  <dd>{artwork.category}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-400">Materials</dt>
                  <dd>{artwork.materials.join(', ')}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-400">Price</dt>
                  <dd className="text-2xl font-bold text-white">
                    ₹{artwork.price.toLocaleString('en-IN')}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">Artist</h2>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2">{artwork.artist.name}</h3>
                <p className="text-gray-300 mb-2">{artwork.artist.bio}</p>
                <p className="text-gray-400">Location: {artwork.artist.location}</p>
                <div className="mt-2">
                  <span className="text-gray-400">Specialties: </span>
                  {artwork.artist.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mt-1">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button className="h-12 w-full bg-blue-600 hover:bg-blue-700">
                Purchase Artwork
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 