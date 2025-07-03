'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Mail, Phone, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import CreateUserModal from './create-user-modal';

const rolePriority = {
  'Admin': 1,
  'Evaluator': 2,
  'Support Admin': 3,
};

export default function UsersTable({ users, loading, onUserCreated, onUserDeleted }) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Check if user has admin permissions
  const isAdmin = session?.user?.role === 'Admin';

const filteredUsers = users
  .filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.mobile && user.mobile.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  .sort((a, b) => {
    const roleA = rolePriority[a.role?.trim()] || 99;
    const roleB = rolePriority[b.role?.trim()] || 99;
    return roleA - roleB;
  });

  const handleCreateUser = async (userData) => {
    try {
      // Call the callback to create the user via API
      if (onUserCreated) {
        await onUserCreated(userData);
      }
      
      // Show success message (you might want to use a toast notification)
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleDeleteUser = async (userId) => {
    // Check if user has admin permissions
    if (!isAdmin) {
      alert('Access denied. Only Admin users can delete users.');
      return;
    }
    
    // Prevent admin from deleting themselves
    if (session?.user?.id === userId) {
      alert('You cannot delete your own account!');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Call the callback to delete the user via API
        if (onUserDeleted) {
          await onUserDeleted(userId);
        }
        
        // Show success message
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className='mb-1'>Users Management</CardTitle>
            <CardDescription>
              Manage and view all registered users ({filteredUsers.length} total)
            </CardDescription>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, email, or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile No.</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No users found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id || user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={
                              user.role === 'Admin' 
                                ? '/static/images/admin_icon.jpeg'
                                : user.role === 'Support Admin'
                                ? '/static/images/support-admin.jpg'
                                : user.role.trim() == 'Evaluator'
                                ? '/static/images/evaluator-icon.jpg'
                                : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.name}`
                            } 
                          />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{user.mobile || user.phone || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-[200px]">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                        {user.role || 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {isAdmin ? (
                        // Check if this is the current user
                        (session?.user?.id === (user._id || user.id)) ? (
                          <span className="text-gray-400 text-sm">Cannot delete self</span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id || user.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )
                      ) : (
                        <span className="text-gray-400 text-sm">No access</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </CardContent>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </Card>
  );
}