'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  PlayCircleIcon,
  StarIcon,
  TvIcon, // Added for show type
  ClockIcon, // Added for episode count
} from '@heroicons/react/24/solid';

export default function AnimeCard({ anime }) {
  const [imgError, setImgError] = useState(false);

  if (!anime || !anime.attributes) {
    return null;
  }

  const title =
    anime.attributes.titles?.en ||
    anime.attributes.titles?.en_jp ||
    anime.attributes.canonicalTitle;
  const imageUrl =
    anime.attributes.posterImage?.small || anime.attributes.posterImage?.tiny;
  const rating = anime.attributes.averageRating
    ? (parseFloat(anime.attributes.averageRating) / 10).toFixed(1)
    : 'N/A';
  const episodeCount = anime.attributes.episodeCount;
  const showType = anime.attributes.showType;
  // Get and truncate synopsis
  const synopsis =
    anime.attributes.synopsis?.substring(0, 60) +
    (anime.attributes.synopsis?.length > 60 ? '...' : '');

  return (
    <div className='bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 group relative flex flex-col'>
      <Link
        href={`/watch/${anime.id}/1`}
        className='block flex flex-col flex-grow'
      >
        <div className='relative w-full aspect-[2/3] bg-gray-700'>
          {!imgError && imageUrl ? (
            <Image
              src={imageUrl}
              alt={title || 'Anime Poster'}
              fill
              sizes='(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw' // Updated sizes for better accuracy
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              onError={() => {
                setImgError(true);
              }}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-500 text-xs'>
              Image unavailable
            </div>
          )}
          {!imgError && imageUrl && (
            <div className='absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <PlayCircleIcon className='h-16 w-16 text-white/90 drop-shadow-lg' />
            </div>
          )}
          {rating !== 'N/A' && (
            <div className='absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center space-x-1 z-10'>
              <StarIcon className='h-3 w-3 text-yellow-400' />
              <span>{rating}</span>
            </div>
          )}
        </div>
        <div className='p-4 flex flex-col flex-grow space-y-2'>
          <h3
            className='text-base font-semibold text-white group-hover:text-purple-300 transition-colors leading-tight'
            title={title}
          >
            {title || 'Untitled Anime'}
          </h3>
          {synopsis && (
            <p className='text-xs text-gray-400 flex-grow line-clamp-2'>
              {' '}
              {synopsis}
            </p>
          )}
          <div className='flex flex-col gap-2 lg:items-center lg:flex-row justify-between text-xs text-gray-400 mt-auto pt-1'>
            {showType && (
              <span className='flex items-center space-x-1'>
                <TvIcon className='h-3.5 w-3.5' />
                <span>{showType.toUpperCase()}</span>
              </span>
            )}
            {episodeCount && (
              <span className='flex items-center space-x-1'>
                <ClockIcon className='h-3.5 w-3.5' />
                <span>
                  {episodeCount} {episodeCount === 1 ? 'Episode' : 'Episodes'}
                </span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
