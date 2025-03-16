'use client';

import { Fragment, useState } from 'react'
import { Dialog, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const navigation = {
  categories: [
    {
      name: 'Artwork',
      featured: [
        { name: 'Paintings', href: '/artwork?category=paintings' },
        { name: 'Digital Art', href: '/artwork?category=digital' },
        { name: 'Photography', href: '/artwork?category=photography' },
        { name: 'Sculptures', href: '/artwork?category=sculptures' },
      ],
    },
  ],
  pages: [
    { name: 'Artists', href: '/artist' },
    { name: 'Sell Art', href: '/artist/publish' },
  ],
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

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
            <Popover.Group className="hidden lg:flex lg:gap-x-12 lg:ml-8">
              {navigation.categories.map((category) => (
                <Popover key={category.name} className="relative">
                  <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-black">
                    {category.name}
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Panel className="absolute top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                      <div className="p-4">
                        {category.featured.map((item) => (
                          <div
                            key={item.name}
                            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                          >
                            <div className="flex-auto">
                              <Link href={item.href} className="block font-semibold text-black">
                                {item.name}
                                <span className="absolute inset-0" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              ))}

              {navigation.pages.map((page) => (
                <Link
                  key={page.name}
                  href={page.href}
                  className="text-sm font-semibold leading-6 text-black"
                >
                  {page.name}
                </Link>
              ))}
            </Popover.Group>

            {/* Search and Cart */}
            <div className="flex flex-1 items-center justify-end gap-x-6">
              <form onSubmit={handleSearch} className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artwork..."
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </form>
              <Link href="/cart" className="p-2">
                <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              </Link>
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
                {navigation.categories.map((category) => (
                  <div key={category.name}>
                    {category.featured.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
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
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
} 