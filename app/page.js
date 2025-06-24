'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import SearchBar from '@/components/search-bar';
import FilterSection from '@/components/filter-section';
import TempleGrid from '@/components/temple-grid';
import FestivalsSection from '@/components/festivals-section';
import Footer from '@/components/footer';
import { templesData } from '@/data/temples-data';

export default function Home() {
  const [temples, setTemples] = useState(templesData);
  const [filteredTemples, setFilteredTemples] = useState(templesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    deity: '',
    state: '',
    architecture: '',
    significance: ''
  });

  useEffect(() => {
    let filtered = temples;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(temple =>
        temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.architecture.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filters
    if (filters.deity) {
      filtered = filtered.filter(temple => temple.deity === filters.deity);
    }
    if (filters.state) {
      filtered = filtered.filter(temple => temple.location.state === filters.state);
    }
    if (filters.architecture) {
      filtered = filtered.filter(temple => temple.architecture === filters.architecture);
    }
    if (filters.significance) {
      filtered = filtered.filter(temple => temple.significance.includes(filters.significance));
    }

    setFilteredTemples(filtered);
  }, [searchQuery, filters, temples]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <Navbar />
      <HeroSection />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-12 xl:py-16">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterSection filters={filters} setFilters={setFilters} />
        <TempleGrid temples={filteredTemples} />
        <FestivalsSection />
      </div>
      
      <Footer />
    </div>
  );
}