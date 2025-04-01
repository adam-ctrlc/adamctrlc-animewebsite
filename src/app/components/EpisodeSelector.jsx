'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlayIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function EpisodeSelector({
  episodes,
  currentEpisodeId,
  onSelectEpisode,
  anime,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [imgErrors, setImgErrors] = useState({});

  // Handle empty episodes array
  if (!episodes || episodes.length === 0) {
    return (
      <div className='bg-gray-800 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-white mb-4'>Episodes</h3>
        <p className='text-gray-400 text-center py-4'>
          No episodes available for this anime.
        </p>
      </div>
    );
  }

  const filteredEpisodes = episodes.filter((episode) => {
    const title =
      episode.attributes.canonicalTitle ||
      `Episode ${episode.attributes.number}`;
    const episodeNumber = episode.attributes.number?.toString() || '';

    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episodeNumber.includes(searchQuery)
    );
  });

  const handleImageError = (episodeId) => {
    setImgErrors((prev) => ({ ...prev, [episodeId]: true }));
  };

  return (
    <div className='bg-gray-800 rounded-lg overflow-hidden'>
      <div className='p-4 border-b border-gray-700'>
        <h3 className='text-lg font-semibold text-white mb-4'>Episodes</h3>

        {/* Search input */}
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            className='bg-gray-700 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none'
            placeholder='Search episodes...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className='max-h-[500px] overflow-y-auto'>
        {filteredEpisodes.length === 0 ? (
          <p className='text-gray-400 text-center p-4'>
            No episodes match your search.
          </p>
        ) : (
          <ul className='divide-y divide-gray-700'>
            {filteredEpisodes.map((episode) => {
              const isCurrentEpisode = episode.id === currentEpisodeId;
              const episodeNumber = episode.attributes.number;
              const title =
                episode.attributes.canonicalTitle || `Episode ${episodeNumber}`;
              const thumbnail =
                episode.attributes.thumbnail?.original ||
                anime.attributes.posterImage?.small;
              const hasImgError = imgErrors[episode.id];

              return (
                <li
                  key={episode.id}
                  className={`p-3 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                    isCurrentEpisode
                      ? 'bg-purple-900/30 border-l-4 border-purple-500'
                      : ''
                  }`}
                  onClick={() => onSelectEpisode(episode.attributes.number)}
                >
                  <div className='flex gap-3'>
                    {/* Episode thumbnail */}
                    <div className='relative w-24 h-16 bg-gray-700 rounded flex-shrink-0 overflow-hidden'>
                      {thumbnail && !hasImgError ? (
                        <Image
                          src={thumbnail}
                          alt={title}
                          fill
                          sizes='96px'
                          className='object-cover'
                          onError={() => handleImageError(episode.id)}
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                          <span className='text-xs text-gray-500'>
                            No image
                          </span>
                        </div>
                      )}

                      {/* Play overlay for current episode */}
                      {isCurrentEpisode && (
                        <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                          <PlayIcon className='h-6 w-6 text-white' />
                        </div>
                      )}
                    </div>

                    {/* Episode info */}
                    <div className='flex-grow min-w-0'>
                      <div className='flex items-center'>
                        <span className='text-xs font-semibold bg-gray-700 rounded px-2 py-0.5 text-gray-300 mr-2'>
                          {episodeNumber}
                        </span>
                        <h4 className='text-sm font-medium text-white truncate'>
                          {title}
                        </h4>
                      </div>

                      {episode.attributes.airdate && (
                        <p className='text-xs text-gray-400 mt-1'>
                          {new Date(
                            episode.attributes.airdate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
