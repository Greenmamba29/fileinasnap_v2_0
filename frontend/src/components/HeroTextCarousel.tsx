import React from 'react';

const HeroTextCarousel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          TEST: HeroTextCarousel is Working!
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          If you can see this dark section with white text, the HeroTextCarousel component is successfully rendering.
        </p>
        <div className="mt-8">
          <button className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg shadow-xl">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroTextCarousel;
