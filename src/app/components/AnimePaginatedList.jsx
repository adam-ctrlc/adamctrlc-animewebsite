'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import AnimeCard from './AnimeCard';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';

export default function AnimePaginatedList({
  title,
  endpoint,
  apiParams = {},
  itemsPerPage = 20,
}) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = parseInt(pageParam || '1', 10);

  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: currentPage,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Use a unique key to force reset the state when switching between sections
  const fetchKey = `${endpoint}-${JSON.stringify(apiParams)}-${currentPage}`;

  const fetchAnimeList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Construct the URL with query parameters for the Kitsu API
      const url = new URL(`https://kitsu.io/api/edge${endpoint}`);

      // Add pagination parameters
      url.searchParams.append('page[limit]', itemsPerPage.toString());
      url.searchParams.append(
        'page[offset]',
        ((currentPage - 1) * itemsPerPage).toString()
      );

      // Add other API parameters
      Object.entries(apiParams).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Handle nested filter parameters like { filter: { status: 'upcoming' } }
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            url.searchParams.append(`filter[${nestedKey}]`, nestedValue);
          });
        } else {
          url.searchParams.append(key, value);
        }
      });

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        // Add cache: 'no-store' to prevent caching issues
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch anime: ${response.statusText}`);
      }

      const data = await response.json();
      setAnimeList(data.data || []);

      // Calculate pagination info
      const total = data.meta?.count || 0;
      const totalPages = Math.ceil(total / itemsPerPage) || 1;

      setPagination({
        currentPage: currentPage,
        totalPages: totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      });
    } catch (err) {
      console.error('Error fetching anime list:', err);
      setError(err.message || 'Failed to load anime');
    } finally {
      setLoading(false);
    }
  }, [endpoint, apiParams, currentPage, itemsPerPage, fetchKey]);

  useEffect(() => {
    fetchAnimeList();
  }, [fetchAnimeList]);

  // Show loading state only on initial load or when changing pages
  const showLoadingState = loading && animeList.length === 0;

  return (
    <div className='min-h-screen bg-gray-900 py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-6'>
          {title}
        </h1>

        {showLoadingState ? (
          <div className='flex justify-center items-center min-h-[50vh]'>
            <LoadingSpinner size='large' />
          </div>
        ) : error ? (
          <div className='bg-red-900/30 border border-red-500 text-white p-6 rounded-lg max-w-lg mx-auto text-center'>
            <h2 className='text-xl font-bold mb-3'>Error</h2>
            <p>{error}</p>
          </div>
        ) : animeList.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-400'>No anime found.</p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
              {animeList.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>

            {loading && !showLoadingState && (
              <div className='flex justify-center my-4'>
                <LoadingSpinner size='small' />
              </div>
            )}

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
