'use client';
import AnimePaginatedList from '../components/AnimePaginatedList';

export default function TopRatedAnimePage() {
  return (
    <AnimePaginatedList
      title='Top Rated Anime'
      endpoint='/anime'
      apiParams={{ sort: '-average_rating' }}
      itemsPerPage={24}
    />
  );
}
