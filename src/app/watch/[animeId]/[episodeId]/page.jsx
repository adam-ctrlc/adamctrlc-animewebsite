'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EpisodePlayer from '../../../components/EpisodePlayer';
import EpisodeInfo from '../../../components/EpisodeInfo';
import EpisodeSelector from '../../../components/EpisodeSelector';
import ErrorDisplay from '../../../components/ErrorDisplay';
import RelatedAnime from '../../../components/RelatedAnime';

export default function WatchEpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { animeId, episodeId: initialEpisodeId } = params; // Rename episodeId from params

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [episodeLoading, setEpisodeLoading] = useState(false); // Add episode-specific loading state
  const [error, setError] = useState(null);

  // Effect for fetching initial anime data and all episodes
  useEffect(() => {
    const fetchAnimeAndEpisodes = async () => {
      setLoading(true);
      setError(null);
      setAnime(null);
      setEpisodes([]);
      setCurrentEpisode(null);
      setCategories([]); // Reset categories on new fetch

      try {
        // Fetch anime details
        const animeResponse = await fetch(
          `https://kitsu.io/api/edge/anime/${animeId}`,
          {
            headers: {
              Accept: 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json',
            },
          }
        );

        if (!animeResponse.ok) {
          throw new Error(`Failed to fetch anime: ${animeResponse.statusText}`);
        }
        const animeData = await animeResponse.json();
        setAnime(animeData.data);

        // Fetch categories
        const categoriesResponse = await fetch(
          `https://kitsu.io/api/edge/anime/${animeId}/categories`,
          {
            headers: {
              Accept: 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json',
            },
          }
        );
        if (!categoriesResponse.ok) {
          // Non-critical error, maybe log it but don't block rendering
          console.error(
            `Failed to fetch categories: ${categoriesResponse.statusText}`
          );
        } else {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.data || []);
        }

        // Fetch episodes (consider fetching all if the API allows, or implement pagination)
        const episodesResponse = await fetch(
          // Fetching more episodes to make the selector more useful
          // Reducing limit back to 20 to avoid potential 400 errors
          `https://kitsu.io/api/edge/anime/${animeId}/episodes?page[limit]=20&sort=number`,
          {
            headers: {
              Accept: 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json',
            },
          }
        );

        if (!episodesResponse.ok) {
          throw new Error(
            `Failed to fetch episodes: ${episodesResponse.statusText}`
          );
        }
        const episodesData = await episodesResponse.json();
        const allEpisodes = episodesData.data;
        setEpisodes(allEpisodes);

        // Find and set the initial episode based on the URL
        const initialEpisode = allEpisodes.find(
          (ep) => ep.attributes.number === parseInt(initialEpisodeId)
        );

        if (initialEpisode) {
          setCurrentEpisode(initialEpisode);
        } else {
          // Fallback to the first episode if the ID is invalid or not found
          if (allEpisodes.length > 0) {
            setCurrentEpisode(allEpisodes[0]);
            // Optionally update URL to reflect the actual first episode shown
            const firstEpisodeNumber = allEpisodes[0].attributes.number;
            const correctUrl = `/watch/${animeId}/${firstEpisodeNumber}`;
            router.replace(correctUrl, undefined, { shallow: true });
          } else {
            throw new Error(`Anime has no episodes.`);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (animeId) {
      fetchAnimeAndEpisodes();
    }
    // Depend only on animeId. Episode changes are handled by handleSelectEpisode
  }, [animeId, router, initialEpisodeId]);

  // Add a new useEffect to handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Get the current episode ID from the URL
      const urlParts = window.location.pathname.split('/');
      const currentEpisodeId = urlParts[urlParts.length - 1];

      // Find and update the current episode based on the URL
      if (episodes.length > 0 && currentEpisodeId) {
        const newEpisode = episodes.find(
          (ep) => ep.attributes.number === parseInt(currentEpisodeId)
        );

        if (newEpisode && newEpisode.id !== currentEpisode?.id) {
          // Show loading state for the player
          setEpisodeLoading(true);

          // Update the current episode
          setCurrentEpisode(newEpisode);

          // Hide loading after a short delay
          setTimeout(() => {
            setEpisodeLoading(false);
          }, 300);
        }
      }
    };

    // Add event listener for popstate (browser back/forward)
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [episodes, currentEpisode]);

  // Handler for selecting a different episode from the selector
  const handleSelectEpisode = (selectedEpisodeNumber) => {
    const newEpisode = episodes.find(
      (ep) => ep.attributes.number === selectedEpisodeNumber
    );

    if (newEpisode && newEpisode.id !== currentEpisode?.id) {
      // Show loading state only for the player component
      setEpisodeLoading(true);

      // First update the current episode in state
      setCurrentEpisode(newEpisode);

      // Then update the URL without a full page navigation
      const newUrl = `/watch/${animeId}/${selectedEpisodeNumber}`;
      window.history.pushState({}, '', newUrl);

      // Hide loading state after a short delay to allow the component to update
      setTimeout(() => {
        setEpisodeLoading(false);
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className='min-h-[80vh] flex items-center justify-center'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title='Error Loading Episode'
        message={error}
        // Provide a way to refetch if needed, e.g., by navigating away and back
        retryAction={() => router.push('/')}
        retryText='Back to Home'
      />
    );
  }

  // Ensure we have the necessary data before rendering the main layout
  if (!anime || !currentEpisode) {
    // This case should ideally be covered by loading/error states,
    // but acts as a fallback.
    return (
      <div className='min-h-[80vh] flex items-center justify-center text-white'>
        Data missing, but not in loading or error state.
      </div>
    );
  }

  const title =
    anime.attributes.titles?.en ||
    anime.attributes.titles?.en_jp ||
    anime.attributes.canonicalTitle;

  return (
    <div className='min-h-screen bg-gray-900 pt-6 pb-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-6'>
          {title}
        </h1>

        {/* Grid Layout - Player wider, Selector narrower */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main content - video player and episode info (now wider) */}
          <div className='lg:col-span-2 space-y-6'>
            {episodeLoading ? (
              <div className='bg-gray-800 rounded-lg aspect-video flex items-center justify-center'>
                <LoadingSpinner size='medium' />
              </div>
            ) : (
              <EpisodePlayer episode={currentEpisode} anime={anime} />
            )}
            <EpisodeInfo episode={currentEpisode} anime={anime} />
          </div>

          {/* Sidebar - episode selector (now narrower) */}
          <div className='lg:col-span-1'>
            <EpisodeSelector
              episodes={episodes}
              currentEpisodeId={currentEpisode.id}
              onSelectEpisode={handleSelectEpisode}
              anime={anime}
            />
          </div>
        </div>

        {/* Related Anime Section */}
        {categories.length > 0 && (
          <RelatedAnime animeId={animeId} categories={categories} />
        )}
      </div>
    </div>
  );
}
