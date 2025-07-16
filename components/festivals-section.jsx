'use client';

import { Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const upcomingFestivals = [
  {
    name: 'Maha Shivaratri',
    date: 'March 8, 2024',
    temple: 'Somnath Temple',
    location: 'Gujarat',
    significance: 'Jyotirlinga',
    description: 'The great night of Lord Shiva celebrated with night-long prayers and fasting.'
  },
  {
    name: 'Brahmotsavam',
    date: 'March 15-24, 2024',
    temple: 'Tirumala Venkateswara',
    location: 'Andhra Pradesh',
    significance: 'Divya Desam',
    description: 'Nine-day festival celebrating Lord Venkateswara with grand processions.'
  },
  {
    name: 'Chithirai Festival',
    date: 'April 12-25, 2024',
    temple: 'Meenakshi Temple',
    location: 'Tamil Nadu',
    significance: 'Shakti Peeth',
    description: 'Celebrates the divine marriage of Meenakshi and Sundareswarar.'
  },
  {
    name: 'Rath Yatra',
    date: 'July 7, 2024',
    temple: 'Jagannath Temple',
    location: 'Odisha',
    significance: 'Char Dham',
    description: 'World-famous chariot festival of Lord Jagannath.'
  }
];

export default function FestivalsSection() {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-900/50 px-4 py-2 rounded-full text-amber-800 dark:text-amber-200 text-base sm:text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Upcoming Sacred Celebrations</span>
        </div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Festival Calendar
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Experience the divine energy of India's most sacred festivals. Plan your spiritual journey around these magnificent celebrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingFestivals.map((festival, index) => (
          <Card key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-playfair text-xl text-gray-900 dark:text-white">
                    {festival.name}
                  </CardTitle>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                    <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                    <span className="text-base sm:text-sm font-medium">{festival.date}</span>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  {festival.significance}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{festival.temple}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-base sm:text-sm">{festival.location}</p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base sm:text-sm leading-relaxed">
                  {festival.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}