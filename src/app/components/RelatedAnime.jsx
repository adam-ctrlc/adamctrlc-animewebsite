'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlayCircleIcon,
  StarIcon,
  TvIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';

function RelatedAnimeCard({ anime }) {
  const [imgError, setImgError] = useState(false);

  const title =
    anime.attributes.titles?.en ||
    anime.attributes.titles?.en_jp ||
    anime.attributes.canonicalTitle;
  const posterImage =
    anime.attributes.posterImage?.small ||
    anime.attributes.posterImage?.original;
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
          {!imgError && posterImage ? (
            <Image
              src={posterImage}
              alt={title || 'Anime Poster'}
              fill
              sizes='(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw'
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              onError={() => setImgError(true)}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-500 text-xs'>
              Image unavailable
            </div>
          )}
          {!imgError && posterImage && (
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

export default function RelatedAnime({ animeId, categories }) {
  const [relatedAnime, setRelatedAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      setRelatedAnime([]);
      return;
    }

    const fetchRelated = async () => {
      setLoading(true);
      setError(null);
      setRelatedAnime([]);

      try {
        const categoryIds = categories.map((cat) => cat.id).join(',');
        if (!categoryIds) return; // No categories to search by

        // Fetch anime filtered by categories, excluding the current one
        // Limit to 5 items
        const url = `https://kitsu.io/api/edge/anime?filter[categories]=${categoryIds}&filter[id][not]=${animeId}&page[limit]=5&sort=-user_count`;

        const response = await fetch(url, {
          headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch related anime: ${response.statusText}`
          );
        }

        const data = await response.json();
        setRelatedAnime(data.data || []);
      } catch (err) {
        console.error('Error fetching related anime:', err);
        setError('Could not load related anime.');
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [animeId, categories]); // Rerun when categories change

  // Decide what to render based on state
  let content;
  if (loading) {
    content = (
      <div className='flex justify-center items-center h-40'>
        <LoadingSpinner size='medium' />
      </div>
    );
  } else if (error) {
    content = <p className='text-gray-400 text-center'>{error}</p>;
  } else if (relatedAnime.length === 0) {
    content = (
      <p className='text-gray-400 text-center'>No related anime found.</p>
    );
  } else {
    content = (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        {relatedAnime.map((anime) => (
          <RelatedAnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    );
  }

  return (
    <div className='mt-10'>
      <h2 className='text-xl font-semibold text-white mb-4'>Related Anime</h2>
      {content}
    </div>
  );
}
