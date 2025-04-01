'use client';
import { Suspense } from 'react';
import AnimePaginatedList from '../components/AnimePaginatedList';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UpcomingAnimePage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-[50vh]'>
          <LoadingSpinner size='large' />
        </div>
      }
    >
      <AnimePaginatedList
        title='Upcoming Anime'
        endpoint='/anime'
        apiParams={{
          filter: { status: 'upcoming' },
          sort: '-start_date',
        }}
        itemsPerPage={24}
      />
    </Suspense>
  );
}
