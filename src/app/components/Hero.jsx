'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';

// Basic Hero component - Needs actual data fetching/logic
export default function Hero({ featuredAnime }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Basic auto-slide functionality (optional)
  useEffect(() => {
    if (!featuredAnime || featuredAnime.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredAnime.length);
    }, 7000); // Change slide every 7 seconds
    return () => clearTimeout(timer);
  }, [currentSlide, featuredAnime]);

  if (!featuredAnime || featuredAnime.length === 0) {
    // Show a loading state or a default hero if no data
    return (
      <div className='relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gray-800 flex items-center justify-center'>
        <LoadingSpinner size='large' />
        <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent'></div>
      </div>
    );
  }

  const anime = featuredAnime[currentSlide];
  if (!anime || !anime.attributes) return null; // Skip if slide data is invalid

  const title =
    anime.attributes.titles?.en ||
    anime.attributes.titles?.en_jp ||
    anime.attributes.canonicalTitle;
  // Prefer cover image for hero, fallback to poster
  const imageUrl =
    anime.attributes.coverImage?.large ||
    anime.attributes.coverImage?.original ||
    anime.attributes.posterImage?.large ||
    '/placeholder-cover.png';
  const synopsis =
    anime.attributes.synopsis?.substring(0, 150) +
    (anime.attributes.synopsis?.length > 150 ? '...' : ''); // Truncate synopsis

  return (
    <div className='relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden'>
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={`Background for ${title}`}
        fill
        priority // Prioritize loading the hero image
        className='object-cover object-center opacity-40'
        onError={(e) => {
          e.target.src = '/placeholder-cover.png';
        }} // Handle image errors
      />

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent'></div>
      <div className='absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent'></div>

      {/* Content */}
      <div className='relative z-10 flex flex-col justify-end h-full container mx-auto px-4 pb-16 md:pb-24'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg'>
          {title || 'Featured Anime'}
        </h1>
        {synopsis && (
          <p className='text-gray-300 text-sm md:text-base max-w-xl mb-6 drop-shadow-md'>
            {synopsis}
          </p>
        )}
        <div className='flex space-x-4'>
          <Link
            href={`/watch/${anime.id}/1`} // Updated to correct watch route
            className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full flex items-center transition-colors duration-300'
          >
            <PlayIcon className='h-5 w-5 mr-2' />
            Watch Now
          </Link>
          <Link
            href={`/search?q=${encodeURIComponent(title)}`} // Changed to search for this anime since there's no details page
            className='bg-gray-700/80 hover:bg-gray-600/80 text-white font-bold py-2 px-6 rounded-full flex items-center transition-colors duration-300'
          >
            <InformationCircleIcon className='h-5 w-5 mr-2' />
            Details
          </Link>
        </div>
      </div>

      {/* Optional: Slide Indicators */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2'>
        {featuredAnime.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentSlide
                ? 'bg-purple-500'
                : 'bg-gray-500/50 hover:bg-gray-400/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
