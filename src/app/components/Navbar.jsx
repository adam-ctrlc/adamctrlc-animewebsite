'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Home' },
    // Popular and Genres links removed
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const baseLinkClass =
    'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200';
  const inactiveLinkClass = 'text-gray-300 hover:bg-gray-700 hover:text-white';
  const activeLinkClass = 'bg-gray-900 text-white'; // Style for active link
  const mobileBaseLinkClass =
    'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200';

  return (
    <nav className='bg-gray-800/80 backdrop-blur-lg sticky top-0 z-50 shadow-lg'>
      {/* Primary Navigation */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo/Brand Section */}
          <div className='flex-shrink-0'>
            <Link
              href='/'
              className='text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors duration-200'
            >
              WatchAnime
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${baseLinkClass} ${
                    pathname === link.href ? activeLinkClass : inactiveLinkClass
                  }`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Form - Desktop */}
          <div className='hidden md:block flex-1 max-w-md mx-4'>
            <form onSubmit={handleSearch} className='flex items-center'>
              <div className='relative w-full'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search anime...'
                  className='w-full px-4 py-2 pl-10 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <MagnifyingGlassIcon
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                </div>
              </div>
              <button
                type='submit'
                className='ml-2 p-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
              >
                Search
              </button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className='-mr-2 flex md:hidden'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
              aria-controls='mobile-menu'
              aria-expanded={isMobileMenuOpen}
            >
              <span className='sr-only'>Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div
          className='md:hidden absolute top-full left-0 w-full bg-gray-800/95 backdrop-blur-lg shadow-xl'
          id='mobile-menu'
        >
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${mobileBaseLinkClass} ${
                  pathname === link.href ? activeLinkClass : inactiveLinkClass
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search in Mobile Menu */}
          <div className='pt-4 pb-3 border-t border-gray-700 px-4'>
            <form onSubmit={handleSearch} className='flex items-center'>
              <div className='relative w-full'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search anime...'
                  className='w-full px-4 py-2 pl-10 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <MagnifyingGlassIcon
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                </div>
              </div>
              <button
                type='submit'
                className='ml-2 p-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
