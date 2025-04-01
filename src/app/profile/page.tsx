'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { PencilIcon, CheckIcon, XMarkIcon, CameraIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  location: string | null;
  specialties: string[];
  image: string | null;
  role: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    if (session?.user?.id) {
      fetchProfileData();
    }
  }, [session, status, router]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch profile data');
      const data = await response.json();
      setProfileData(data);
      setOriginalData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
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
    if (!profileData) return;

    try {
      let imageUrl = profileData.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'art-realm');

        const uploadResponse = await fetch(
          'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
      }

      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileData,
          image: imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const updatedData = await response.json();
      setProfileData(updatedData);
      setOriginalData(updatedData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData(originalData);
    setImagePreview(null);
    setImageFile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">No Profile Found</h2>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Card className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="relative w-32 h-32">
                  <Image
                    src={imagePreview || profileData.image || '/images/default-avatar.jpg'}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {isEditing && (
                    <label
                      htmlFor="profile-image"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <CameraIcon className="h-8 w-8 text-white" />
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {isEditing && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Click to change profile picture
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={isEditing ? 'border-blue-300 focus:ring-2 focus:ring-blue-500' : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <Textarea
                  value={profileData.bio || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  className={isEditing ? 'border-blue-300 focus:ring-2 focus:ring-blue-500' : ''}
                  rows={4}
                  placeholder={isEditing ? "Tell us about yourself..." : "No bio added yet"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  type="text"
                  value={profileData.location || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                  disabled={!isEditing}
                  className={isEditing ? 'border-blue-300 focus:ring-2 focus:ring-blue-500' : ''}
                  placeholder={isEditing ? "Enter your location" : "No location added"}
                />
              </div>

              {profileData.role === 'ARTIST' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialties
                  </label>
                  <Input
                    type="text"
                    value={profileData.specialties.join(', ')}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        specialties: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    disabled={!isEditing}
                    className={isEditing ? 'border-blue-300 focus:ring-2 focus:ring-blue-500' : ''}
                    placeholder={isEditing ? "E.g. Painting, Sculpture, Digital Art" : "No specialties added"}
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CheckIcon className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </div>
      </Card>
    </div>
  );
} 