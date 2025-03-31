'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: 'BUYER' | 'ARTIST';
}

const navigation = {
  main: [
    { name: 'All Artworks', href: '/artwork' },
    { name: 'Featured Artists', href: '/artists' },
    { 
      name: 'Eco-Friendly Art', 
      href: '/eco-friendly',
      icon: SparklesIcon,
      className: 'text-green-600 hover:text-green-700'
    },
  ],
  pages: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as CustomUser;

  return (
    <header className="bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Logo */}
            <div className="ml-4 flex lg:ml-0">
              <Link href="/">
                <span className="sr-only">Art Realm</span>
                <span className="text-2xl font-bold text-black">Art Realm</span>
              </Link>
            </div>

            {/* Navigation links */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-8">
              {navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium flex items-center gap-1 ${
                    item.className || 'text-gray-700 hover:text-gray-800'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
              {navigation.pages.map((page) => (
                <Link
                  key={page.name}
                  href={page.href}
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  {page.name}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="flex items-center">
              {session ? (
                <div className="flex items-center space-x-4">
                  {user?.role === 'ARTIST' && (
                    <Link
                      href="/artist/dashboard"
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Art Realm</span>
              <span className="text-2xl font-bold text-black">Art Realm</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.main.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 flex items-center gap-2 ${
                      item.className || 'text-black'
                    }`}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {item.name}
                  </Link>
                ))}
                {navigation.pages.map((page) => (
                  <Link
                    key={page.name}
                    href={page.href}
                    className="block px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-gray-50"
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {session ? (
                  <div className="space-y-2">
                    {user?.role === 'ARTIST' && (
                      <Link
                        href="/artist/dashboard"
                        className="block px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="block px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-gray-50 w-full text-left"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      className="block px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-gray-50"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-gray-50"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}