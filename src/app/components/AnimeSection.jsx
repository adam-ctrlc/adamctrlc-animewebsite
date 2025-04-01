'use client';

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import AnimeCard from './AnimeCard';
import LoadingSpinner from './LoadingSpinner';

export default function AnimeSection({
  title,
  animeList,
  viewMoreLink,
  loading,
  className,
}) {
  // Show loading spinners if loading and no data yet
  const showLoadingPlaceholders =
    loading && (!animeList || animeList.length === 0);

  return (
    <section className={`container mx-auto lg:px-4 ${className || ''}`}>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold text-white'>{title}</h2>
      </div>

      {/* Grid for Anime Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {showLoadingPlaceholders ? (
          // Render placeholder loaders
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='bg-gray-800 rounded-lg aspect-[2/3] flex items-center justify-center'
            >
              <LoadingSpinner size='small' />
            </div>
          ))
        ) : animeList && animeList.length > 0 ? (
          // Render actual anime cards
          animeList.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
        ) : (
          // Handle case where there's no data (and not loading)
          <p className='text-gray-400 col-span-full text-center'>
            No anime found in this category.
          </p>
        )}
      </div>
    </section>
  );
}
