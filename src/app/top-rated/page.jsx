'use client';
import { Suspense } from 'react';
import AnimePaginatedList from '../components/AnimePaginatedList';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TopRatedAnimePage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-[50vh]'>
          <LoadingSpinner size='large' />
        </div>
      }
    >
      <AnimePaginatedList
        title='Top Rated Anime'
        endpoint='/anime'
        apiParams={{ sort: '-average_rating' }}
        itemsPerPage={24}
      />
    </Suspense>
  );
}
