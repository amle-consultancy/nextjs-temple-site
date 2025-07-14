'use client';

import TempleCard from './temple-card';

export default function TempleGrid({ temples }) {
  if (temples.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-4 opacity-50">
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🏛️</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No temples found</h3>
        <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white">
          Popular Temples
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {temples.slice(0, 9).map((temple) => (
          <TempleCard key={temple.name} temple={temple} />
        ))}
      </div>
    </div>
  );
}