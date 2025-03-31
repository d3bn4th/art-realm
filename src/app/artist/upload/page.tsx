'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function UploadArtwork() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error('Please login as an artist to upload artwork');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      
      // Upload image first
      if (imageFile) {
        const imageData = new FormData();
        imageData.append('file', imageFile);
        // Add image upload logic here
      }

      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          price: parseFloat(formData.get('price') as string),
          category: formData.get('category'),
          materials: (formData.get('materials') as string).split(',').map(m => m.trim()),
          isEcoFriendly: formData.get('isEcoFriendly') === 'true',
          image: '/images/placeholder.jpg', // Replace with actual uploaded image path
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create artwork');
      }

      toast.success('Artwork uploaded successfully!');
      router.push('/artist/dashboard');
      router.refresh();
    } catch (error) {
      toast.error('Failed to upload artwork');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upload New Artwork</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price (in INR)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            step="1"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Painting">Painting</option>
            <option value="Sculpture">Sculpture</option>
            <option value="Photography">Photography</option>
            <option value="Digital">Digital Art</option>
            <option value="Mixed Media">Mixed Media</option>
            <option value="Installation">Installation</option>
          </select>
        </div>

        <div>
          <label htmlFor="materials" className="block text-sm font-medium mb-2">
            Materials (comma-separated)
          </label>
          <input
            type="text"
            id="materials"
            name="materials"
            required
            placeholder="Oil Paint, Canvas, Wood"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Is this artwork eco-friendly?
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="isEcoFriendly"
                value="true"
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isEcoFriendly"
                value="false"
                className="mr-2"
                defaultChecked
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-2">
            Artwork Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Artwork'}
        </button>
      </form>
    </div>
  );
} 