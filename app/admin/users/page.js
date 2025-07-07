'use client';

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import UsersTable from '@/components/admin/users-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useUsers } from '@/hooks/use-users';

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const { 
    users, 
    loading, 
    error,
    loaded,
    loadUsers, 
    addUser, 
    removeUser 
  } = useUsers();

  // Check if user has permission to access this page
  const hasPermission = session?.user?.role === 'Admin';

  useEffect(() => {
    if (!hasPermission) {
      return;
    }

    // Load users using Redux thunk
    loadUsers();
  }, [hasPermission, loadUsers]);

  const handleUserCreated = async (newUser) => {
    try {
      // Use Redux thunk to create user
      const resultAction = await addUser(newUser);
      
      // Check if the action was fulfilled
      if (resultAction.meta && resultAction.meta.requestStatus === 'fulfilled') {
        return resultAction.payload.data;
      } else {
        throw new Error(resultAction.payload || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const handleUserDeleted = async (userId) => {
    try {
      // Use Redux thunk to delete user
      const resultAction = await removeUser(userId);
      
      // Check if the action was fulfilled
      if (resultAction.meta && resultAction.meta.requestStatus === 'fulfilled') {
        return true;
      } else {
        throw new Error(resultAction.payload || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };
  
  // Function to explicitly reload users data
  const handleRefresh = useCallback(() => {
    loadUsers(true); // Force reload
  }, [loadUsers]);

  // Show access denied if user doesn't have permission
  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">Access Denied</h2>
            <p className="text-gray-600 text-center dark:text-white">
              You don't have permission to access this page. Only Admin users can manage users.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if there was a problem loading users
  if (error && !loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">Error Loading Users</h2>
            <p className="text-gray-600 text-center dark:text-white">
              {error}
            </p>
            <Button 
              onClick={() => loadUsers(true)} 
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users Table */}
      <UsersTable 
        users={users} 
        loading={loading} 
        onUserCreated={handleUserCreated} 
        onUserDeleted={handleUserDeleted} 
        onRefresh={handleRefresh}
      />
    </div>
  );
}