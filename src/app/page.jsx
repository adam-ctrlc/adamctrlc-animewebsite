'use client';

import Hero from './components/Hero';
import AnimeSection from './components/AnimeSection';
import LoadingSpinner from './components/LoadingSpinner';
import { useAnimeContext } from './utils/AnimeContext';

export default function Home() {
  const {
    trendingAnime,
    popularAnime,
    topRatedAnime,
    upcomingAnime,
    loading,
    error,
    fetchData,
  } = useAnimeContext();

  if (error) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center'>
        <div className='bg-red-900/30 border border-red-500 text-white p-6 rounded-lg max-w-lg text-center shadow-lg'>
          <h2 className='text-xl font-bold mb-3'>Error Loading Anime Data</h2>
          <p className='mb-4'>{error}</p>
          <button
            onClick={fetchData}
            className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const initialLoading =
    loading &&
    !trendingAnime?.length &&
    !popularAnime?.length &&
    !topRatedAnime?.length &&
    !upcomingAnime?.length;

  return (
    <div className='min-h-screen bg-gray-900'>
      <div id='hero'>
        <Hero featuredAnime={trendingAnime?.slice(0, 5) || []} />
      </div>

      <div className='py-12 space-y-12'>
        <div id='trending'>
          <AnimeSection
            title='Trending Now'
            animeList={trendingAnime}
            viewMoreLink='/trending'
            loading={loading}
          />
        </div>

        <div id='popular'>
          <AnimeSection
            title='Most Popular'
            animeList={popularAnime}
            viewMoreLink='/popular'
            loading={loading}
          />
        </div>

        <div id='top-rated'>
          <AnimeSection
            title='Top Rated'
            animeList={topRatedAnime}
            viewMoreLink='/top-rated'
            loading={loading}
          />
        </div>

        <div id='upcoming'>
          <AnimeSection
            title='Upcoming Releases'
            animeList={upcomingAnime}
            viewMoreLink='/upcoming'
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
