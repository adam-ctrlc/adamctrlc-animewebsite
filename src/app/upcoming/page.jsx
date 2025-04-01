'use client';
import AnimePaginatedList from '../components/AnimePaginatedList';

export default function UpcomingAnimePage() {
  return (
    <AnimePaginatedList
      title='Upcoming Anime'
      endpoint='/anime'
      apiParams={{
        filter: { status: 'upcoming' },
        sort: '-start_date',
      }}
      itemsPerPage={24}
    />
  );
}
