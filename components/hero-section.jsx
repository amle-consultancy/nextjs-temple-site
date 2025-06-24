'use client';

import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-amber-500/10 to-yellow-500/10 dark:from-orange-900/30 dark:via-amber-800/30 dark:to-yellow-700/30"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-orange-300/30 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-amber-300/30 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
      
      <div className="container mx-auto px-4 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/50 px-4 py-2 rounded-full text-orange-800 dark:text-orange-200 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Discover India's Sacred Heritage</span>
          </div>
          
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Journey Through
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600">
              Divine Temples
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Explore thousands of sacred temples across India. Discover by deity, architecture, region, and spiritual significance. 
            Connect with ancient wisdom and timeless traditions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <MapPin className="w-5 h-5 text-orange-600" />
              <span>3000+ Temples</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span>Festival Calendar</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <span>Cultural Stories</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}