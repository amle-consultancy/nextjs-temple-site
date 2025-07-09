import { configureStore } from "@reduxjs/toolkit";
import placesReducer from "./features/places/placesSlice";
import usersReducer from "./features/users/usersSlice";
// import approvalReducer from "./features/approvals/approvalSlice";

export const store = configureStore({
  reducer: {
    places: placesReducer,
    users: usersReducer,
    // approvals: approvalSlice, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
