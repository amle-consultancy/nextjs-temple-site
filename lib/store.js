import { configureStore } from '@reduxjs/toolkit';
import placesReducer from './features/places/placesSlice';
import usersReducer from './features/users/usersSlice';

export const store = configureStore({
  reducer: {
    places: placesReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});