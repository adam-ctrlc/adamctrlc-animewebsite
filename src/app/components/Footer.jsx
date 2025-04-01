'use client';

import Link from 'next/link';
import {
  HomeIcon,
  FireIcon,
  TvIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-900 border-t border-gray-800 mt-16 py-12 text-gray-400'>
      <div className='container mx-auto px-4'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
          {/* Logo & Description */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-purple-400 mb-4'>
              WatchAnime
            </h2>
            <p className='text-sm text-gray-400 max-w-md'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse
              mollitia, incidunt possimus commodi quod ipsum debitis odio quo
              quas a ducimus voluptatibus officiis veritatis quos, molestiae,
              aspernatur temporibus porro. Sint.
            </p>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-300 mb-3'>
              Quick Links
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/#hero'
                  className='inline-flex items-center hover:text-purple-400 transition-colors duration-200'
                >
                  <HomeIcon className='h-4 w-4 mr-2' />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/#trending'
                  className='inline-flex items-center hover:text-purple-400 transition-colors duration-200'
                >
                  <FireIcon className='h-4 w-4 mr-2' />
                  <span>Trending</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/#popular'
                  className='inline-flex items-center hover:text-purple-400 transition-colors duration-200'
                >
                  <TvIcon className='h-4 w-4 mr-2' />
                  <span>Popular</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/#top-rated'
                  className='inline-flex items-center hover:text-purple-400 transition-colors duration-200'
                >
                  <StarIcon className='h-4 w-4 mr-2' />
                  <span>Top Rated</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-300 mb-3'>Legal</h3>
            <p className='text-sm'>
              Disclaimer: This site does not store any files on its server. All
              contents are provided by non-affiliated third parties.
            </p>
            <p className='text-sm'>
              &copy; {currentYear} WatchAnime. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
