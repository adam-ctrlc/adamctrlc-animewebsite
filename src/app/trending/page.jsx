'use client';
import AnimePaginatedList from '../components/AnimePaginatedList';

export default function TrendingAnimePage() {
  return (
    <AnimePaginatedList
      title='Trending Anime'
      endpoint='/trending/anime'
      itemsPerPage={24}
    />
  );
}
