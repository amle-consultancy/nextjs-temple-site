'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TempleCard({ temple }) {
  return (
    <Card className="group overflow-hidden bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link href={`/temple/${temple._id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={temple.image}
            alt={temple.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 right-3">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              {temple.deity}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-playfair font-bold text-white text-lg mb-1 line-clamp-2">
              {temple.name}
            </h3>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
            <MapPin className="w-4 h-4 mr-2 text-orange-600" />
            <span className="text-sm">{temple.location.city}, {temple.location.state}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
            <Clock className="w-4 h-4 mr-2 text-orange-600" />
            <span className="text-sm">{temple.constructionPeriod}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="secondary" className="text-xs">
              {temple.architecture}
            </Badge>
            {Array.isArray(temple.significance) && temple.significance.map((sig, index) => (
              <Badge key={index} variant="outline" className="text-xs border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300">
                {sig}
              </Badge>
            ))}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {temple.description}
          </p>
          

        </CardContent>
      </Link>
    </Card>
  );
}