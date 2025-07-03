'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Phone, Globe, Plus, Trash2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import AddPlaceForm from './add-place-form';

export default function PlacesTable({ places, onPlaceCreated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDeity, setFilterDeity] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      console.log('Submitting new place:', formData);
      
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create place');
      }
      
      console.log('Place created successfully:', result.data);
      
      // Close the form
      setIsFormOpen(false);
      
      // Call the callback to refresh places list
      if (onPlaceCreated) {
        onPlaceCreated();
      }
      
      // You can add a toast notification here
      // toast.success('Place created successfully!');
      
    } catch (error) {
      console.error('Error creating place:', error);
      // You can add error handling here
      // toast.error(error.message || 'Failed to create place');
      throw error; // Re-throw to let the form handle it
    }
  };

  // Handle place deletion
  const handleDeletePlace = async (placeId, placeName) => {
    if (!confirm(`Are you sure you want to delete "${placeName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete place');
      }

      console.log('Place deleted successfully:', result);

      // Call the callback to refresh places list
      if (onPlaceCreated) {
        onPlaceCreated();
      }

      // You can add a toast notification here
      // toast.success('Place deleted successfully!');

    } catch (error) {
      console.error('Error deleting place:', error);
      alert(`Failed to delete place: ${error.message}`);
      // You can add error handling here
      // toast.error(error.message || 'Failed to delete place');
    }
  };

  // Get unique deities and states for filters
  const deities = [...new Set(places.map(place => place.deity).filter(Boolean))];
  const states = [...new Set(places.map(place => place.location?.state).filter(Boolean))];

  const filteredPlaces = places.filter(place => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (place.name && place.name.toLowerCase().includes(searchLower)) ||
      (place.deity && place.deity.toLowerCase().includes(searchLower)) ||
      (place.location?.city && place.location.city.toLowerCase().includes(searchLower)) ||
      (place.location?.state && place.location.state.toLowerCase().includes(searchLower)) ||
      (place.architecture && place.architecture.toLowerCase().includes(searchLower)) ||
      (place.location?.pincode && place.location.pincode.includes(searchTerm)) ||
      (place.location?.district && place.location.district.toLowerCase().includes(searchLower));

    const matchesDeity = filterDeity === 'all' || place.deity === filterDeity;
    const matchesState = filterState === 'all' || place.location?.state === filterState;

    return matchesSearch && matchesDeity && matchesState;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Places Management</CardTitle>
            <CardDescription>
              Manage and view all temples and sacred places ({filteredPlaces.length} total)
            </CardDescription>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Place
          </Button>
        </div>
        
        {/* Add Place Form Modal */}
        <AddPlaceForm 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search places by name, deity, location, pincode, or architecture..."
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
                <TableHead>Temple Name</TableHead>
                <TableHead>Deity & Architecture</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlaces.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No places found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlaces.map((place) => (
                  <TableRow key={place._id || place.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {place.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {place.constructionPeriod ? `Built: ${place.constructionPeriod}` : 'Construction period not specified'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="secondary" className="mb-1">
                          {place.deity || 'N/A'}
                        </Badge>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {place.architecture ? `${place.architecture} Architecture` : 'Architecture not specified'}
                        </div>
                        {place.builtBy && (
                          <div className="text-xs text-gray-500">
                            By: {place.builtBy}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">{place.location?.city || 'N/A'}</div>
                          <div className="text-sm text-gray-500">
                            {place.location?.district && `${place.location.district}, `}
                            {place.location?.state || 'N/A'}
                          </div>
                          {place.location?.pincode && (
                            <div className="text-xs text-gray-400">
                              PIN: {place.location.pincode}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {place.contact?.phone && (
                          <div className="flex items-center text-xs">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="truncate">{place.contact.phone}</span>
                          </div>
                        )}
                        {place.contact?.website && (
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
                        {!place.contact?.phone && !place.contact?.website && (
                          <div className="text-xs text-gray-500">
                            No contact info
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlace(place._id || place.id, place.name)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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