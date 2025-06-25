'use client';

import { useEffect, useState } from 'react';
import UsersTable from '@/components/admin/users-table';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const userData = await res.json();
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserCreated = (newUser) => {
    // In a real application, you would refetch the users from the API
    // For now, we'll just add the new user to the existing list
    const userWithId = {
      ...newUser,
      id: users.length + 1,
      username: newUser.name.toLowerCase().replace(/\s+/g, ''),
      phone: newUser.mobile || 'N/A',
      website: 'N/A',
      address: {
        street: newUser.address || 'N/A',
        city: 'N/A',
        zipcode: 'N/A'
      },
      company: {
        name: 'N/A',
        catchPhrase: 'N/A'
      }
    };
    
    setUsers(prevUsers => [userWithId, ...prevUsers]);
  };

  const handleUserDeleted = (userId) => {
    // Remove the user from the list
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  return (
    <div className="space-y-6">
      {/* Users Table */}
      <UsersTable users={users} loading={loading} onUserCreated={handleUserCreated} onUserDeleted={handleUserDeleted} />
    </div>
  );
}