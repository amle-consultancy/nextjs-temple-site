'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PlacesTable from '@/components/admin/places-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { 
  fetchPlaces, 
  forceReload,
  selectPlaces, 
  selectPlacesLoading, 
  selectPlacesError,
  selectPlacesDataLoaded
} from '@/lib/features/places/placesSlice';

export default function AdminPlacesPage() {
  const dispatch = useDispatch();
  const places = useSelector(selectPlaces);
  const loading = useSelector(selectPlacesLoading);
  const error = useSelector(selectPlacesError);
  const dataLoaded = useSelector(selectPlacesDataLoaded);

  // Fetch places data using Redux Toolkit's createAsyncThunk
  const loadPlaces = () => {
    // Only fetch if data hasn't been loaded yet
    if (!dataLoaded) {
      dispatch(fetchPlaces());
    }
  };

  // Force reload places data
  const handleReload = () => {
    dispatch(forceReload()); // Reset the dataLoaded flag
    dispatch(fetchPlaces()); // Fetch fresh data
  };

  useEffect(() => {
    loadPlaces();
  }, [dispatch, dataLoaded]);

  // Handle place creation success - refresh the list
  const handlePlaceCreated = () => {
    handleReload(); // Use the reload function to refresh data
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
              </div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Places Management</CardTitle>
            <CardDescription>Error loading places data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Failed to load places: {error}</p>
              <button 
                onClick={handleReload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Places Table */}
      <PlacesTable 
        places={places} 
        onPlaceCreated={handlePlaceCreated}
        onReload={handleReload}
        isLoading={loading}
      />
    </div>
  );
}