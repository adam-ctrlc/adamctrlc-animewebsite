'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construct the URL with query parameters for the Kitsu API
        const url = new URL('https://kitsu.io/api/edge/anime');
        url.searchParams.append('filter[text]', query);
        url.searchParams.append('page[limit]', '20');

        const response = await fetch(url.toString(), {
          headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
          },
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();
        setSearchResults(data.data || []);
      } catch (err) {
        console.error('Error searching anime:', err);
        setError(err.message || 'Failed to search anime');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Render based on state
  return (
    <div className='min-h-screen bg-gray-900 py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-6'>
          {query ? `Search Results for "${query}"` : 'Search Anime'}
        </h1>

        {loading ? (
          <div className='flex justify-center items-center min-h-[50vh]'>
            <LoadingSpinner size='large' />
          </div>
        ) : error ? (
          <div className='bg-red-900/30 border border-red-500 text-white p-6 rounded-lg max-w-lg mx-auto text-center'>
            <h2 className='text-xl font-bold mb-3'>Error</h2>
            <p>{error}</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-400'>
              {query
                ? `No results found for "${query}". Try a different search term.`
                : 'Enter a search term to find anime.'}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
            {searchResults.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-[50vh]'>
          <LoadingSpinner size='large' />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
