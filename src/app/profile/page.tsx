'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';

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

      // If a new image was selected, upload it first
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

      // Update profile data
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
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!profileData) {
    return <div className="p-8">No profile data found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-8">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={imagePreview || profileData.image || '/images/default-avatar.jpg'}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          {isEditing && (
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4"
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              type="text"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={profileData.email} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <Textarea
              value={profileData.bio || ''}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              disabled={!isEditing}
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input
              type="text"
              value={profileData.location || ''}
              onChange={(e) =>
                setProfileData({ ...profileData, location: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          {profileData.role === 'ARTIST' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Specialties (comma-separated)
              </label>
              <Input
                type="text"
                value={profileData.specialties.join(', ')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProfileData({
                    ...profileData,
                    specialties: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                disabled={!isEditing}
              />
            </div>
          )}

          <div className="flex gap-4 mt-8">
            {isEditing ? (
              <>
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                signOut();
                router.push('/');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 