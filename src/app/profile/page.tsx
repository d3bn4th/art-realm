'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchProfileData = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        console.error('No user ID available in session');
        setLoading(false);
        return;
      }

      console.log('Fetching profile data for user ID:', session.user.id);
      const response = await fetch(`/api/users/${session.user.id}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch profile data: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Profile data fetched successfully');
      setProfileData(data);
      setOriginalData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error(`Failed to load profile data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    if (session?.user?.id) {
      fetchProfileData();
    }
  }, [session, status, router, fetchProfileData]);

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
      setLoading(true);
      let imageUrl = profileData.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        try {
          console.log('Uploading profile image');
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error(`Image upload failed (${uploadResponse.status}):`, errorText);
            throw new Error(`Image upload failed: ${uploadResponse.status} - ${errorText}`);
          }
          
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
          console.log('Image uploaded successfully');
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error(`Failed to upload image: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
          setLoading(false);
          return;
        }
      }

      console.log('Updating profile for user ID:', session?.user?.id);
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Profile update failed (${response.status}):`, errorText);
        throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
      }

      const updatedData = await response.json();
      setProfileData(updatedData);
      setOriginalData(updatedData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12 px-4">
      <Card className="max-w-3xl mx-auto bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-[#4ADE80] to-[#3B82F6] bg-clip-text text-transparent">Profile</h1>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3 text-base bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
              >
                <PencilIcon className="h-5 w-5" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex items-center gap-2 px-6 py-3 text-base bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="relative w-32 h-32">
                  <Image
                    src={imagePreview || profileData.image || '/images/default-avatar.jpg'}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover border-4 border-gray-800 shadow-lg"
                  />
                  {isEditing && (
                    <label
                      htmlFor="profile-image"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
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
                  <p className="text-sm text-gray-300 text-center mt-2">
                    Click to change profile picture
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 ${
                    isEditing 
                      ? 'bg-gray-800 border-gray-700 focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-300'
                  } rounded-lg`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-800 border-gray-700 rounded-lg text-gray-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <Textarea
                  value={profileData.bio || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 ${
                    isEditing 
                      ? 'bg-gray-800 border-gray-700 focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-300'
                  } rounded-lg`}
                  rows={4}
                  placeholder={isEditing ? "Tell us about yourself..." : "No bio added yet"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  value={profileData.location || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 ${
                    isEditing 
                      ? 'bg-gray-800 border-gray-700 focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-300'
                  } rounded-lg`}
                  placeholder={isEditing ? "Enter your location" : "No location added"}
                />
              </div>

              {profileData.role === 'ARTIST' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
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
                    className={`w-full px-4 py-2 ${
                      isEditing 
                        ? 'bg-gray-800 border-gray-700 focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] text-white' 
                        : 'bg-gray-800 border-gray-700 text-gray-300'
                    } rounded-lg`}
                    placeholder={isEditing ? "E.g. Painting, Sculpture, Digital Art" : "No specialties added"}
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg px-6 py-2 flex items-center gap-2"
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