import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className='flex flex-col items-center justify-center mt-16 md:mt-20'>
      {/* Ensure the image is responsive */}
      <img src={imgSrc} alt="No results found" className='w-24 md:w-32 lg:w-40' />

      {/* Centered message with better responsiveness */}
      <p className='w-4/5 sm:w-3/4 md:w-1/2 lg:w-1/3 text-sm font-medium text-slate-700 text-center mt-6 md:mt-8'>
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
