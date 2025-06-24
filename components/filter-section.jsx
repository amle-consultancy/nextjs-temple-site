'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const deities = ['Shiva', 'Vishnu', 'Shakti', 'Ganesha', 'Hanuman', 'Murugan', 'Brahma', 'Surya'];
const states = ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Kerala', 'Maharashtra', 'Odisha', 'Rajasthan', 'Gujarat', 'Uttar Pradesh', 'Madhya Pradesh'];
const architectures = ['Dravidian', 'Nagara', 'Vesara', 'Indo-Islamic', 'Rock-cut'];
const significances = ['Jyotirlinga', 'Shakti Peeth', 'Divya Desam', 'Pancharama Kshetra', 'Char Dham', 'Ashtavinayak'];

export default function FilterSection({ filters, setFilters }) {
  const clearFilters = () => {
    setFilters({
      deity: '',
      state: '',
      architecture: '',
      significance: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  return (
    <div className="mb-8">
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deity</label>
            <Select value={filters.deity} onValueChange={(value) => setFilters(prev => ({ ...prev, deity: value }))}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-orange-200 dark:border-orange-700">
                <SelectValue placeholder="Select deity" />
              </SelectTrigger>
              <SelectContent>
                {deities.map(deity => (
                  <SelectItem key={deity} value={deity}>{deity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
            <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-orange-200 dark:border-orange-700">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Architecture</label>
            <Select value={filters.architecture} onValueChange={(value) => setFilters(prev => ({ ...prev, architecture: value }))}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-orange-200 dark:border-orange-700">
                <SelectValue placeholder="Select architecture" />
              </SelectTrigger>
              <SelectContent>
                {architectures.map(arch => (
                  <SelectItem key={arch} value={arch}>{arch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Significance</label>
            <Select value={filters.significance} onValueChange={(value) => setFilters(prev => ({ ...prev, significance: value }))}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-orange-200 dark:border-orange-700">
                <SelectValue placeholder="Select significance" />
              </SelectTrigger>
              <SelectContent>
                {significances.map(sig => (
                  <SelectItem key={sig} value={sig}>{sig}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}