'use client';
import { Suspense } from 'react';
import AnimePaginatedList from '../components/AnimePaginatedList';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PopularAnimePage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-[50vh]'>
          <LoadingSpinner size='large' />
        </div>
      }
    >
      <AnimePaginatedList
        title='Most Popular Anime'
        endpoint='/anime'
        apiParams={{ sort: '-user_count' }}
        itemsPerPage={24}
      />
    </Suspense>
  );
}
