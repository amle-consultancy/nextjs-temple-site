import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { MapPin } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <MapPin className="w-12 h-12 text-white animate-bounce" />
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Loading Sacred Journey...
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Preparing your divine experience
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-orange-800 mb-8">
            <div className="space-y-4">
              <div className="h-4 bg-gradient-to-r from-orange-200 to-amber-200 dark:from-orange-800 dark:to-amber-800 rounded-full animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-orange-200 to-amber-200 dark:from-orange-800 dark:to-amber-800 rounded-full animate-pulse w-3/4 mx-auto"></div>
              <div className="h-4 bg-gradient-to-r from-orange-200 to-amber-200 dark:from-orange-800 dark:to-amber-800 rounded-full animate-pulse w-1/2 mx-auto"></div>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="animate-pulse">
              "Patience is the companion of wisdom."
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}