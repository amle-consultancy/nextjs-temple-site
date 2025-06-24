'use client';

import Image from 'next/image';
import { MapPin, Clock, Calendar, Star, Navigation, Phone, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function TempleProfile({ temple }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image
              src={temple.image}
              alt={temple.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">
                {temple.name}
              </h1>
              <div className="flex items-center text-white/90">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{temple.location.city}, {temple.location.district}, {temple.location.state}</span>
              </div>
            </div>
          </div>

          {/* Combined Content */}
          <Card>
            <CardHeader>
              <CardTitle>Temple Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* About Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About This Temple</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {temple.detailedDescription}
                </p>
              </div>

              {/* Temple Details */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Temple Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Primary Deity</h4>
                    <p className="text-gray-700 dark:text-gray-300">{temple.deity}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Architecture Style</h4>
                    <p className="text-gray-700 dark:text-gray-300">{temple.architecture}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Construction Period</h4>
                    <p className="text-gray-700 dark:text-gray-300">{temple.constructionPeriod}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Built By</h4>
                    <p className="text-gray-700 dark:text-gray-300">{temple.builtBy}</p>
                  </div>
                </div>
              </div>

              {/* Historical Significance */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Historical Significance</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {temple.history}
                </p>
              </div>

              {/* Major Festivals */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Major Festivals</h3>
                <div className="space-y-4">
                  {temple.festivals.map((festival, index) => (
                    <div key={index} className="border-l-4 border-orange-500 pl-4 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-r-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{festival.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{festival.period}</p>
                      <p className="text-gray-700 dark:text-gray-300">{festival.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rating</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="font-semibold">{temple.rating}</span>
                  <span className="text-gray-500 ml-1">({temple.reviews})</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Significance</h4>
                <div className="flex flex-wrap gap-1">
                  {temple.significance.map((sig, index) => (
                    <Badge key={index} variant="outline" className="border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300">
                      {sig}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visit Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 text-orange-600 mr-2" />
                Visit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Darshan Timings</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Morning:</span>
                    <span className="text-gray-900 dark:text-white">{temple.timings.morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Evening:</span>
                    <span className="text-gray-900 dark:text-white">{temple.timings.evening}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Entry Fee</h4>
                <p className="text-gray-700 dark:text-gray-300">{temple.entryFee}</p>
              </div>

              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{temple.contact.phone}</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-gray-400 mr-3" />
                <a href={temple.contact.website} className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">
                  Official Website
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}