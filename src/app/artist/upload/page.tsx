'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface UploadFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  materials: string;
  isEcoFriendly: boolean;
}

export default function UploadArtwork() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin?callbackUrl=/artist/upload');
    },
  });

  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    materials: '',
    isEcoFriendly: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload image first
      const imageFormData = new FormData();
      imageFormData.append('file', imageFile);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: imageFormData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(`Failed to upload image: ${errorData.error || 'Unknown error'}`);
      }
      
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url; // Updated to match our Cloudinary API response

      // Create artwork
      const artworkData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        materials: formData.materials ? formData.materials.split(',').map(m => m.trim()).filter(Boolean) : [],
        isEcoFriendly: formData.isEcoFriendly,
        image: imageUrl,
      };

      const artworkRes = await fetch('/api/artist/artwork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artworkData),
      });

      if (!artworkRes.ok) {
        const error = await artworkRes.json();
        throw new Error(error.message || 'Failed to create artwork');
      }

      toast.success('Artwork uploaded successfully!');
      router.push('/artist/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload artwork');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ARTIST') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload New Artwork</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artwork Image
                </label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative w-64 h-64 mx-auto">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                >
                  <option value="">Select a category</option>
                  <option value="painting">Painting</option>
                  <option value="sculpture">Sculpture</option>
                  <option value="photography">Photography</option>
                  <option value="digital">Digital Art</option>
                  <option value="mixed-media">Mixed Media</option>
                </select>
              </div>

              {/* Materials */}
              <div>
                <label htmlFor="materials" className="block text-sm font-medium text-gray-700">
                  Materials (comma-separated)
                </label>
                <input
                  type="text"
                  id="materials"
                  required
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  placeholder="e.g., oil paint, canvas, wood"
                />
              </div>

              {/* Eco-Friendly */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEcoFriendly"
                  checked={formData.isEcoFriendly}
                  onChange={(e) => setFormData({ ...formData, isEcoFriendly: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded text-black"
                />
                <label htmlFor="isEcoFriendly" className="ml-2 block text-sm text-gray-700">
                  This artwork is made with eco-friendly materials
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Artwork'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 