'use client';

import { useEffect, useState } from 'react';
import UsersTable from '@/components/admin/users-table';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Users Table */}
      <UsersTable users={users} loading={loading} onUserCreated={handleUserCreated} onUserDeleted={handleUserDeleted} />
    </div>
  );
}