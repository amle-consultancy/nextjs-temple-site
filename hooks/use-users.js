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
} from '@/lib/features/users/usersSlice';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  const totalCount = useAppSelector(selectUsersTotalCount);

  // Actions
  const loadUsers = useCallback(() => {
    return dispatch(fetchUsers());
  }, [dispatch]);

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