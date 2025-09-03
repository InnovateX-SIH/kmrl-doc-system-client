import React from 'react';

const SplashScreen = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-black'>
      {/* Example: Video background */}
      <video
        src='public/WhatsApp Video 2025-09-03 at 13.22.31_0517b8f4.mp4' // public folder me video rakho
        autoPlay
        muted
        playsInline
        className='w-full h-full object-cover'
      />
      {/* <h1 className='absolute text-4xl font-bold text-white animate-pulse'>
        Welcome 🚀
      </h1> */}
    </div>
  );
};

export default SplashScreen;
