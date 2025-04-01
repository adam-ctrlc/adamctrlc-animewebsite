'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function EpisodeInfo({ episode, anime }) {
  const [imgError, setImgError] = useState(false);

  if (!episode || !anime) return null;

  const { canonicalTitle, synopsis, thumbnail, airdate, length } =
    episode.attributes;

  const episodeNumber = episode.attributes.number;
  const episodeTitle = canonicalTitle || `Episode ${episodeNumber}`;
  const formattedAirdate = airdate
    ? new Date(airdate).toLocaleDateString()
    : 'Unknown';
  const thumbnailUrl =
    thumbnail?.original || anime.attributes.posterImage?.large;

  return (
    <div className='bg-gray-800 rounded-lg overflow-hidden'>
      <div className='p-6'>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Episode thumbnail */}
          {thumbnailUrl && !imgError ? (
            <div className='w-full md:w-1/3 lg:w-1/4 flex-shrink-0'>
              <div className='relative aspect-video bg-gray-700 rounded-lg overflow-hidden'>
                <Image
                  src={thumbnailUrl}
                  alt={episodeTitle}
                  fill
                  sizes='(max-width: 768px) 100vw, 300px'
                  className='object-cover'
                  onError={() => setImgError(true)}
                />
              </div>
            </div>
          ) : (
            <div className='w-full md:w-1/3 lg:w-1/4 flex-shrink-0'>
              <div className='relative aspect-video bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center'>
                <span className='text-gray-500 text-sm'>
                  No image available
                </span>
              </div>
            </div>
          )}

          {/* Episode info */}
          <div className='flex-grow'>
            <h2 className='text-xl font-bold text-white mb-2'>
              Episode {episodeNumber}: {episodeTitle}
            </h2>

            <div className='flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 mb-4'>
              {airdate && (
                <div className='flex items-center'>
                  <CalendarIcon className='h-4 w-4 mr-1' />
                  <span>Aired: {formattedAirdate}</span>
                </div>
              )}

              {length && (
                <div className='flex items-center'>
                  <ClockIcon className='h-4 w-4 mr-1' />
                  <span>{length} min</span>
                </div>
              )}
            </div>

            {synopsis ? (
              <p className='text-gray-300 text-sm md:text-base leading-relaxed'>
                {synopsis}
              </p>
            ) : (
              <p className='text-gray-500 italic'>
                No synopsis available for this episode.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
