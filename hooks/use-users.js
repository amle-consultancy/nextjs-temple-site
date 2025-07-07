import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './use-redux';
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  clearError,
  clearCurrentUser,
  selectUsers,
  selectCurrentUser,
  selectUsersLoading,
  selectUsersError,
  selectUsersTotalCount,
  selectUsersLoaded,
} from '@/lib/features/users/usersSlice';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  const totalCount = useAppSelector(selectUsersTotalCount);
  const loaded = useAppSelector(selectUsersLoaded);

  // Actions
  const loadUsers = useCallback((forceReload = false) => {
    // Only fetch if not loaded or if force reload is requested
    if (!loaded || forceReload) {
      return dispatch(fetchUsers());
    }
    return Promise.resolve(); // Return resolved promise if already loaded
  }, [dispatch, loaded]);

  const loadUserById = useCallback((id) => {
    return dispatch(fetchUserById(id));
  }, [dispatch]);

  const addUser = useCallback((userData) => {
    return dispatch(createUser(userData));
  }, [dispatch]);

  const editUser = useCallback((id, userData) => {
    return dispatch(updateUser({ id, userData }));
  }, [dispatch]);

  const removeUser = useCallback((id) => {
    return dispatch(deleteUser(id));
  }, [dispatch]);

  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetCurrentUser = useCallback(() => {
    dispatch(clearCurrentUser());
  }, [dispatch]);

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    totalCount,
    loaded,
    
    // Actions
    loadUsers,
    loadUserById,
    addUser,
    editUser,
    removeUser,
    clearUserError,
    resetCurrentUser,
  };
};