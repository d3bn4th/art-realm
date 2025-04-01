'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function UploadArtwork() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    materials: '',
    isEcoFriendly: false,
    image: null as File | null,
  });

  useEffect(() => {
    // Check if user is not an artist and redirect
    if (status === 'authenticated' && session?.user?.role !== 'ARTIST') {
      toast.error('Only artists can upload artworks');
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (status !== 'authenticated' || !session) {
    router.push('/auth/signin?callbackUrl=/dashboard/upload');
    return null;
  }

  if (session.user.role !== 'ARTIST') {
    return null; // The useEffect will handle the redirect
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Uploading artwork...');

    try {
      // First, upload the image
      const imageFormData = new FormData();
      imageFormData.append('file', formData.image);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: imageFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { imageUrl } = await uploadResponse.json();

      // Then create the artwork
      const artworkData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        materials: formData.materials.split(',').map(m => m.trim()),
        isEcoFriendly: formData.isEcoFriendly,
        image: imageUrl,
      };

      const createResponse = await fetch('/api/artworks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artworkData),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create artwork');
      }

      toast.success('Artwork uploaded successfully!', { id: toastId });
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to upload artwork. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Upload New Artwork
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Materials (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Canvas, Oil paint, Wood"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isEcoFriendly"
                  checked={formData.isEcoFriendly}
                  onChange={(e) => setFormData({ ...formData, isEcoFriendly: e.target.checked })}
                  className="w-4 h-4 text-green-500 border-gray-700 rounded focus:ring-green-500"
                />
                <label htmlFor="isEcoFriendly" className="text-sm font-medium">
                  This artwork uses eco-friendly materials
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Artwork Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {imagePreview && (
                  <div className="mt-4 relative aspect-square w-full max-w-xs">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Artwork'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 