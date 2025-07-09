import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Search } from 'lucide-react';

export default function TempleSearchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 w-64 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto animate-pulse"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-orange-800 mb-12">
            <div className="space-y-6">
              <div>
                <div className="h-7 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2 animate-pulse"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <div className="h-14 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                </div>
                <div className="h-4 w-96 bg-gray-300 dark:bg-gray-700 rounded-lg mt-2 animate-pulse"></div>
              </div>
              
              <div className="flex justify-center">
                <div className="h-14 w-48 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Temple Results Loading */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </div>
      
      <Footer />
    </div>
  );
}