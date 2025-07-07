'use client';

import { useEffect } from 'react';
import { useUsers } from '@/hooks/use-users';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, RefreshCw } from 'lucide-react';

export default function UsersList() {
  const { 
    users, 
    loading, 
    error, 
    loadUsers 
  } = useUsers();

  useEffect(() => {
    // Load users on component mount
    loadUsers();
  }, [loadUsers]);

  const handleRefresh = () => {
    loadUsers();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription className="text-red-500">Error loading users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Showing {users.length} users
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-center text-gray-500">No users found</p>
          ) : (
            users.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage 
                      src={
                        user.role === 'Admin' 
                          ? '/static/images/admin_icon.jpeg'
                          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.name}`
                      } 
                    />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-3 w-3 mr-1" />
                      <span>{user.email}</span>
                    </div>
                    {user.mobile && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{user.mobile}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                  {user.role || 'User'}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}