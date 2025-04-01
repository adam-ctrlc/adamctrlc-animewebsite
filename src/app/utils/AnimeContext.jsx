'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchKitsuData } from './kitsuApi'; // We'll create this next

// 1. Create Context
const AnimeContext = createContext({
  trendingAnime: [],
  popularAnime: [],
  topRatedAnime: [],
  upcomingAnime: [],
  loading: true,
  error: null,
  fetchData: async () => {}, // Placeholder for potential refetch logic
});

// 2. Create Provider Component
export const AnimeProvider = ({ children }) => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [topRatedAnime, setTopRatedAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use Promise.all to fetch all categories concurrently
      const [trending, popular, topRated, upcoming] = await Promise.all([
        fetchKitsuData('/trending/anime', { limit: 10 }), // Example endpoint
        fetchKitsuData('/anime', { sort: '-user_count', limit: 10 }), // Example: Popular
        fetchKitsuData('/anime', { sort: '-average_rating', limit: 10 }), // Example: Top Rated
        fetchKitsuData('/anime', {
          filter: { status: 'upcoming' },
          sort: '-start_date',
          limit: 10,
        }), // Example: Upcoming
      ]);

      // Basic error check (kitsuApi should handle specific errors)
      if (!trending || !popular || !topRated || !upcoming) {
        throw new Error('Failed to fetch one or more anime categories.');
      }

      setTrendingAnime(trending);
      setPopularAnime(popular);
      setTopRatedAnime(topRated);
      setUpcomingAnime(upcoming);
    } catch (err) {
      console.error('Error fetching anime data:', err);
      setError(err.message || 'An unknown error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on initial mount

  const value = {
    trendingAnime,
    popularAnime,
    topRatedAnime,
    upcomingAnime,
    loading,
    error,
    fetchData, // Expose fetchData if manual refetching is needed
  };

  return (
    <AnimeContext.Provider value={value}>{children}</AnimeContext.Provider>
  );
};

// 3. Create Custom Hook to Use Context
export const useAnimeContext = () => {
  const context = useContext(AnimeContext);
  if (context === undefined) {
    throw new Error('useAnimeContext must be used within an AnimeProvider');
  }
  return context;
};
