'use client';

import { useEffect } from 'react';
import TempleCard from './temple-card';
import { usePlaces } from '@/hooks/use-places';

export default function TempleGridRedux() {
  const {
    places,
    loading,
    error,
    filters,
    totalCount,
    loadPlaces,
    clearPlaceError
  } = usePlaces();

  // Load places when component mounts or filters change
  useEffect(() => {
    loadPlaces(filters);
  }, [loadPlaces, filters]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearPlaceError();
    };
  }, [clearPlaceError]);

  if (loading) {
    return (
      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white">
            Discovered Temples
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loading skeleton */}
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-4 opacity-50">
          <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">⚠️</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error loading temples</h3>
        <p className="text-gray-500 dark:text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => loadPlaces(filters)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (places.length === 0) {
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
          Discovered Temples
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {totalCount} temple{totalCount !== 1 ? 's' : ''} found
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((temple) => (
          <TempleCard key={temple._id} temple={temple} />
        ))}
      </div>
    </div>
  );
}