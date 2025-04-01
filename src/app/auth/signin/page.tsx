'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'BUYER' | 'ARTIST'>('BUYER');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        role: userType,
        redirect: false,
        callbackUrl,
      });

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Signed in successfully!');
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      toast.error('An error occurred during sign in');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 mx-auto">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Sign in to your account
          </h2>
        </div>

        {/* User Type Toggle */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setUserType('BUYER')}
            className={`px-4 py-2 rounded-md transition-all ${
              userType === 'BUYER'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setUserType('ARTIST')}
            className={`px-4 py-2 rounded-md transition-all ${
              userType === 'ARTIST'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Artist
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-400">Don&apost have an account? </span>
            <Link 
              href="/auth/register" 
              className="font-medium text-green-500 hover:text-green-400"
            >
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 