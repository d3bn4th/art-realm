'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'BUYER' | 'ARTIST'>('BUYER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '', // Only for artists
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userType,
          bio: userType === 'ARTIST' ? formData.bio : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to signin page on success
      router.push('/auth/signin');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-md w-full mx-auto space-y-8">
        <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-[#4ADE80] to-[#3B82F6] bg-clip-text text-transparent">
          Create your account
        </h1>

        <div className="flex justify-center gap-2 mb-6">
          <Button
            type="button"
            onClick={() => setUserType('BUYER')}
            className={`h-10 w-24 rounded-lg ${
              userType === 'BUYER'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Buyer
          </Button>

          <Button
            type="button"
            onClick={() => setUserType('ARTIST')}
            className={`w-32 rounded-lg ${
              userType === 'ARTIST'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Artist
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
            placeholder="Full Name"
          />

          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
            placeholder="Email address"
          />

          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
            placeholder="Password"
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
            placeholder="Confirm Password"
          />

          {userType === 'ARTIST' && (
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
              placeholder="Tell us about yourself (optional)"
              rows={4}
            />
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg py-3 font-medium mt-6"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>

          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link 
              href="/auth/signin" 
              className="text-[#4ADE80] hover:text-[#3EB76D] font-medium"
            >
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 