"use client";

import { useState, useEffect } from "react";
import { usePlaces } from "@/hooks/use-places";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TempleGridRedux from "@/components/temple-grid-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowDown } from "lucide-react";
import Image from "next/image";

export default function TempleSearchPage() {
  const { updateFilters, resetFilters } = usePlaces();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Reset filters when component unmounts
  useEffect(() => {
    return () => {
      resetFilters();
    };
  }, [resetFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    let query = searchQuery.trim();
    // Remove 'temple' or 'temples' (case-insensitive) from the query
    query = query.replace(/\btemples?\b/gi, "").trim();

    // If the original query only contains 'temple' or 'temples', show alert
    if (/^temples?$/i.test(searchQuery.trim())) {
      alert("Search for Specific Temple");
      return;
    }

    if (query === "") {
      resetFilters();
    } else {
      updateFilters({ search: query });
    }
    setShowResults(true);

    // Scroll to results section
    setTimeout(() => {
      const resultsSection = document.getElementById("temple-results");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <Navbar />
      {/* Hero section with search */}
      <div className="min-h-screen flex items-center relative">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-800/80 to-orange-600/80 z-10"></div>
          <div className="absolute inset-0 bg-[url('/images/temple-bg-pattern.png')] opacity-10 z-5"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Discover Sacred Temples
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
                Explore India's ancient spiritual heritage through its magnificent temples
              </p>
            </div>

            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg p-6 shadow-lg border-t border-l border-white/20 dark:border-white/5">
              <form onSubmit={handleSearch} className="space-y-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <div className="relative outline-none">
                      <Search className="absolute left-3 outline-none top-1/2 transform -translate-y-1/2 text-amber-600 dark:text-amber-400 w-5 h-5" />
                      <Input
                        id="templeSearch"
                        type="text"
                        placeholder="Search by temple name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 py-2 bg-white/80 dark:bg-gray-700/80 outline-none border-amber-200 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-500 rounded-md w-full"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
                      Examples: Meenakshi Amman, Tirupati, Kedarnath
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md transition-colors duration-200 whitespace-nowrap"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {/* Scroll down indicator */}
            <div className="text-center mt-10 animate-bounce">
              <button
                onClick={() => {
                  const resultsSection = document.getElementById("temple-results");
                  if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-white/70 hover:text-white transition-colors"
              >
                <ArrowDown className="w-6 h-6 mx-auto" />
                <span className="sr-only">View results</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results section */}
      <div id="temple-results" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <TempleGridRedux limitResults={9} />
          
          <div className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 p-8 md:p-12 dark:border-orange-900/30">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-orange-800 dark:text-orange-300 mb-8 text-center">
              The Divine Architecture of India
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white/70 dark:bg-gray-800/50 p-6 rounded-xl shadow-md border border-orange-100 dark:border-orange-900/30">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-3">Nagara Style (North Indian)</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Characterized by their beehive-shaped towers (shikhara), Nagara temples feature a curvilinear spire that symbolizes the cosmic mountain. 
                  These temples typically have an elaborate entrance porch (mandapa) and a sanctum (garbhagriha). 
                  Notable examples include Khajuraho Temples and the Sun Temple at Konark.
                </p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/50 p-6 rounded-xl shadow-md border border-orange-100 dark:border-orange-900/30">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-3">Dravida Style (South Indian)</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Distinguished by their pyramidal towers (vimana), Dravida temples feature stepped structures with pavilions (hara) and a crowned cupola (stupi). 
                  These temples often include massive gateway towers (gopurams) and pillared halls (mandapas). 
                  The Brihadeeswarar Temple and Meenakshi Temple exemplify this magnificent style.
                </p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/50 p-6 rounded-xl shadow-md border border-orange-100 dark:border-orange-900/30">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-3">Vesara Style (Hybrid)</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  A harmonious blend of Nagara and Dravida styles, Vesara architecture emerged in the Deccan region. 
                  These temples feature a stellate (star-shaped) plan and ornate sculptural work. 
                  The Hoysala temples of Belur and Halebidu showcase this intricate architectural fusion.
                </p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/50 p-6 rounded-xl shadow-md border border-orange-100 dark:border-orange-900/30">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-3">Historical Evolution</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Indian temple architecture evolved over millennia, from simple rock-cut shrines (3rd century BCE) to elaborate structural temples. 
                  Each dynasty—Gupta, Chalukya, Pallava, Chola, Hoysala—contributed unique elements, reflecting regional variations and cultural exchanges. 
                  These sacred structures stand as testaments to India's architectural ingenuity and spiritual devotion.
                </p>
              </div>
            </div>
            
            <p className="text-center text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Explore these architectural marvels in detail through our temple collection. Each temple tells a story of faith, 
              artistic excellence, and the enduring spiritual heritage of India.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
