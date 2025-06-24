'use client';

import { useState } from 'react';
import { Search, MapPin, Star, Calendar, Phone, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PlacesTable({ places }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDeity, setFilterDeity] = useState('all');
  const [filterState, setFilterState] = useState('all');

  // Get unique deities and states for filters
  const deities = [...new Set(places.map(place => place.deity))];
  const states = [...new Set(places.map(place => place.location.state))];

  const filteredPlaces = places.filter(place => {
    const matchesSearch = 
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.deity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.architecture.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDeity = filterDeity === 'all' || place.deity === filterDeity;
    const matchesState = filterState === 'all' || place.location.state === filterState;

    return matchesSearch && matchesDeity && matchesState;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Places Management</CardTitle>
        <CardDescription>
          Manage and view all temples and sacred places ({filteredPlaces.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search places by name, deity, location, or architecture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterDeity} onValueChange={setFilterDeity}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Deity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deities</SelectItem>
              {deities.map(deity => (
                <SelectItem key={deity} value={deity}>{deity}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterState} onValueChange={setFilterState}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Places Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Temple</TableHead>
                <TableHead>Deity & Architecture</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rating & Reviews</TableHead>
                <TableHead>Significance</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlaces.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No places found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlaces.map((place) => (
                  <TableRow key={place.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 rounded-lg">
                          <AvatarImage src={place.image} alt={place.name} />
                          <AvatarFallback className="rounded-lg">
                            {place.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {place.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Built: {place.constructionPeriod}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="secondary" className="mb-1">
                          {place.deity}
                        </Badge>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {place.architecture} Architecture
                        </div>
                        <div className="text-xs text-gray-500">
                          By: {place.builtBy}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">{place.location.city}</div>
                          <div className="text-sm text-gray-500">
                            {place.location.district}, {place.location.state}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{place.rating}</span>
                        <span className="text-gray-500">
                          ({place.reviews.toLocaleString()})
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Entry: {place.entryFee}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {place.significance.slice(0, 2).map((sig, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {sig}
                          </Badge>
                        ))}
                        {place.significance.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{place.significance.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="truncate">{place.contact.phone}</span>
                        </div>
                        {place.contact.website && (
                          <div className="flex items-center text-xs">
                            <Globe className="h-3 w-3 mr-1 text-gray-400" />
                            <a
                              href={place.contact.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 truncate"
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredPlaces.length} of {places.length} places
        </div>
      </CardContent>
    </Card>
  );
}