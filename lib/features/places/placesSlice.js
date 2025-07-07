import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching all places
export const fetchPlaces = createAsyncThunk(
  'places/fetchPlaces',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.deity) queryParams.append('deity', filters.deity);
      if (filters.search) queryParams.append('search', filters.search);
      
      const url = `/api/places${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching a single place by ID
export const fetchPlaceById = createAsyncThunk(
  'places/fetchPlaceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/places/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch place');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating a new place
export const createPlace = createAsyncThunk(
  'places/createPlace',
  async (placeData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create place');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating a place
export const updatePlace = createAsyncThunk(
  'places/updatePlace',
  async ({ id, placeData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/places/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update place');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a place
export const deletePlace = createAsyncThunk(
  'places/deletePlace',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/places/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete place');
      }
      
      return { id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  places: [],
  currentPlace: null,
  loading: false,
  error: null,
  dataLoaded: false, // Flag to track if data has been loaded
  filters: {
    state: '',
    city: '',
    deity: '',
    search: '',
  },
  totalCount: 0,
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        state: '',
        city: '',
        deity: '',
        search: '',
      };
    },
    clearCurrentPlace: (state) => {
      state.currentPlace = null;
    },
    forceReload: (state) => {
      state.dataLoaded = false; // Reset the dataLoaded flag to force a reload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch places
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload.data || [];
        state.totalCount = action.payload.count || 0;
        state.dataLoaded = true; // Mark data as loaded
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch place by ID
      .addCase(fetchPlaceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlace = action.payload.data;
      })
      .addCase(fetchPlaceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create place
      .addCase(createPlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlace.fulfilled, (state, action) => {
        state.loading = false;
        state.places.unshift(action.payload.data);
        state.totalCount += 1;
      })
      .addCase(createPlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update place
      .addCase(updatePlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlace.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.places.findIndex(place => place._id === action.payload.data._id);
        if (index !== -1) {
          state.places[index] = action.payload.data;
        }
        if (state.currentPlace && state.currentPlace._id === action.payload.data._id) {
          state.currentPlace = action.payload.data;
        }
      })
      .addCase(updatePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete place
      .addCase(deletePlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.loading = false;
        state.places = state.places.filter(place => place._id !== action.payload.id);
        state.totalCount -= 1;
        if (state.currentPlace && state.currentPlace._id === action.payload.id) {
          state.currentPlace = null;
        }
      })
      .addCase(deletePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearFilters, clearCurrentPlace, forceReload } = placesSlice.actions;

// Selectors
export const selectPlaces = (state) => state.places.places;
export const selectCurrentPlace = (state) => state.places.currentPlace;
export const selectPlacesLoading = (state) => state.places.loading;
export const selectPlacesError = (state) => state.places.error;
export const selectPlacesFilters = (state) => state.places.filters;
export const selectPlacesTotalCount = (state) => state.places.totalCount;
export const selectPlacesDataLoaded = (state) => state.places.dataLoaded;

export default placesSlice.reducer;