'use client';
import AnimePaginatedList from '../components/AnimePaginatedList';

export default function PopularAnimePage() {
  return (
    <AnimePaginatedList
      title='Most Popular Anime'
      endpoint='/anime'
      apiParams={{ sort: '-user_count' }}
      itemsPerPage={24}
    />
  );
}
