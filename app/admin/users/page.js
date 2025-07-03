'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import UsersTable from '@/components/admin/users-table';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user has permission to access this page
  const hasPermission = session?.user?.role === 'Admin';

  useEffect(() => {
    if (!hasPermission) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const result = await response.json();
        
        if (result.success) {
          setUsers(result.data);
        } else {
          console.error('Error fetching users:', result.error);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [hasPermission]);

  const handleUserCreated = async (newUser) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const result = await response.json();

      if (result.success) {
        // Add the new user to the beginning of the list
        setUsers(prevUsers => [result.data, ...prevUsers]);
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const handleUserDeleted = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Remove the user from the list
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Users Table */}
      <UsersTable users={users} loading={loading} onUserCreated={handleUserCreated} onUserDeleted={handleUserDeleted} />
    </div>
  );
}