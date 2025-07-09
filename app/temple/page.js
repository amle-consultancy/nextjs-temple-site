'use client';

import { useState, useEffect } from 'react';
import { usePlaces } from '@/hooks/use-places';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import TempleGridRedux from '@/components/temple-grid-redux';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowDown } from 'lucide-react';
import Image from 'next/image';

export default function TempleSearchPage() {
  const { updateFilters, resetFilters } = usePlaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Reset filters when component unmounts
  useEffect(() => {
    return () => {
      resetFilters();
    };
  }, [resetFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: searchQuery });
    setShowResults(true);
    
    // Scroll to results section
    setTimeout(() => {
      const resultsSection = document.getElementById('temple-results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <Navbar />
      
      {/* Full-height hero section with search */}
      <div className="min-h-[calc(100vh-64px)] flex items-center relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-amber-500/80 to-yellow-400/70 z-10"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                Temple Search
              </h1>
              <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
                Discover sacred temples and deities across India
              </p>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-2xl border border-orange-200 dark:border-orange-800">
              <form onSubmit={handleSearch} className="space-y-8">
                <div>
                  <label htmlFor="templeSearch" className="block text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Temple / Deity Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                    <Input
                      id="templeSearch"
                      type="text"
                      placeholder="Enter temple or deity name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-14 pr-4 py-7 text-xl bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-800 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Try searching for "Meenakshi Amman", "Shiva", "Tirupati", or "Kedarnath"
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-7 text-xl rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Search Temples
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Scroll down indicator */}
            <div className="text-center mt-12 animate-bounce">
              <button 
                onClick={() => {
                  const resultsSection = document.getElementById('temple-results');
                  if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ArrowDown className="w-8 h-8 mx-auto" />
                <span className="sr-only">Scroll down</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results section */}
      <div id="temple-results" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Temple Results */}
          <TempleGridRedux limitResults={6} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}