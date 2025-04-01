'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function ErrorDisplay({
  title = 'Error',
  message,
  retryAction,
  retryText = 'Try Again',
}) {
  return (
    <div className='min-h-[50vh] flex items-center justify-center'>
      <div className='bg-red-900/30 border border-red-500 text-white p-6 rounded-lg max-w-lg text-center shadow-lg'>
        <div className='flex justify-center mb-4'>
          <ExclamationTriangleIcon className='h-12 w-12 text-red-500' />
        </div>
        <h2 className='text-xl font-bold mb-3'>{title}</h2>
        <p className='mb-4'>{message}</p>
        {retryAction && (
          <button
            onClick={retryAction}
            className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300'
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}
