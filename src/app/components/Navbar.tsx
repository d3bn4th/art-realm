'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SparklesIcon, UserCircleIcon, ChevronDownIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';

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
    { name: 'Feed', href: '/social-feed' },
    { name: 'Auctions', href: '/auctions' },
    { 
      name: 'Eco-Friendly Art', 
      href: '/eco-friendly',
      icon: SparklesIcon,
      className: 'text-green-600 hover:text-green-700'
    },
    {
      name: 'Eco Initiatives',
      href: '/eco-initiatives',
      icon: SparklesIcon,
      className: 'text-green-600 hover:text-green-700'
    },
  ],
  pages: [
    { name: 'About', href: '/about' }
  ],
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user as CustomUser;
  const pathname = usePathname();
  const { cart } = useCart();
  const [isClient, setIsClient] = useState(false);
  
  // Fix hydration mismatch by only rendering cart count on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/auth/signin',
      redirect: true
    });
  };

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
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/favicon.ico"
                  alt="Art Realm Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
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
                    pathname === item.href
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-gray-800'
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
                  className={`text-sm font-medium ${
                    pathname === page.href
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-gray-800'
                  }`}
                >
                  {page.name}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="flex items-center">
              {/* Cart Button */}
              <Link href="/cart" className="mr-4 p-1 relative text-gray-700 hover:text-gray-800">
                <ShoppingCartIcon className="h-6 w-6" />
                {isClient && cart.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </Link>
              
              {status === 'authenticated' && session ? (
                <div className="flex items-center space-x-4">
                  {/* User Profile Dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-gray-800">
                      <UserCircleIcon className="h-8 w-8" />
                      <span className="text-sm font-medium">{user?.name}</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div className="py-1 bg-white rounded-md">
                          {user?.role === 'ARTIST' && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/artist/dashboard"
                                  className={`${
                                    active ? 'bg-gray-50' : 'bg-white'
                                  } block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50`}
                                >
                                  Dashboard
                                </Link>
                              )}
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/profile"
                                className={`${
                                  active ? 'bg-gray-50' : 'bg-white'
                                } block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50`}
                              >
                                Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleSignOut}
                                className={`${
                                  active ? 'bg-gray-50' : 'bg-white'
                                } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50`}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/signin"
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
                {/* Add Cart Link to Mobile Menu */}
                <Link
                  href="/cart"
                  className="block px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 flex items-center gap-2 text-black"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Cart {isClient && cart.items.length > 0 && `(${cart.items.length})`}
                </Link>
                
                {navigation.main.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 flex items-center gap-2 ${
                      pathname === item.href ? 'text-blue-800' : 'text-black'
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
                    className={`block px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 ${
                      pathname === page.href ? 'text-blue-800' : 'text-black'
                    }`}
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {status === 'authenticated' && session ? (
                  <div className="space-y-2">
                    {user?.role === 'ARTIST' && (
                      <Link
                        href="/artist/dashboard"
                        className="block px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-gray-50 w-full text-left"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
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