import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './use-redux';
import {
  fetchPlaces,
  fetchPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  clearError,
  setFilters,
  clearFilters,
  clearCurrentPlace,
  selectPlaces,
  selectCurrentPlace,
  selectPlacesLoading,
  selectPlacesError,
  selectPlacesFilters,
  selectPlacesTotalCount,
} from '@/lib/features/places/placesSlice';

export const usePlaces = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const places = useAppSelector(selectPlaces);
  const currentPlace = useAppSelector(selectCurrentPlace);
  const loading = useAppSelector(selectPlacesLoading);
  const error = useAppSelector(selectPlacesError);
  const filters = useAppSelector(selectPlacesFilters);
  const totalCount = useAppSelector(selectPlacesTotalCount);

  // Actions
  const loadPlaces = useCallback((filters = {}) => {
    return dispatch(fetchPlaces(filters));
  }, [dispatch]);

  const loadPlaceById = useCallback((id) => {
    return dispatch(fetchPlaceById(id));
  }, [dispatch]);

  const addPlace = useCallback((placeData) => {
    return dispatch(createPlace(placeData));
  }, [dispatch]);

  const editPlace = useCallback((id, placeData) => {
    return dispatch(updatePlace({ id, placeData }));
  }, [dispatch]);

  const removePlace = useCallback((id) => {
    return dispatch(deletePlace(id));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const clearPlaceError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetCurrentPlace = useCallback(() => {
    dispatch(clearCurrentPlace());
  }, [dispatch]);

  return {
    // State
    places,
    currentPlace,
    loading,
    error,
    filters,
    totalCount,
    
    // Actions
    loadPlaces,
    loadPlaceById,
    addPlace,
    editPlace,
    removePlace,
    updateFilters,
    resetFilters,
    clearPlaceError,
    resetCurrentPlace,
  };
};