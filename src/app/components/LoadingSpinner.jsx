'use client';

// Simple SVG-based loading spinner
export default function LoadingSpinner({ size = 'medium' }) {
  // Define sizing based on the size prop
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-24 w-24',
  };

  return (
    <div className='flex justify-center items-center'>
      <svg
        className={`animate-spin text-purple-500 ${
          sizeClasses[size] || sizeClasses.medium
        }`}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        ></circle>
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        ></path>
      </svg>
    </div>
  );
}
