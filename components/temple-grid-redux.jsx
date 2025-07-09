'use client';

import { useEffect } from 'react';
import TempleCard from './temple-card';
import { usePlaces } from '@/hooks/use-places';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TempleGridRedux({ limitResults }) {
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

  // Limit the number of displayed temples if limitResults is provided
  const displayedTemples = limitResults ? places.slice(0, limitResults) : places;
  
  // Calculate if there are more temples than what we're showing
  const hasMoreTemples = limitResults && places.length > limitResults;

  if (loading) {
    return (
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white">
            Discovering Temples...
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Loading skeleton - always show 6 when limited */}
          {[...Array(limitResults || 6)].map((_, index) => (
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
        <Button
          onClick={() => loadPlaces(filters)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Try Again
        </Button>
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white">
          Discovered Temples
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {limitResults && places.length > limitResults 
            ? `Showing ${limitResults} of ${totalCount} temples` 
            : `${totalCount} temple${totalCount !== 1 ? 's' : ''} found`}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedTemples.map((temple) => (
          <TempleCard key={temple._id} temple={temple} />
        ))}
      </div>
    </div>
  );
}