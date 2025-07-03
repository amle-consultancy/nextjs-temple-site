'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ApprovalsPage() {
  const { data: session } = useSession();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Check if user has permission to access this page
  const hasPermission = session?.user?.role === 'Admin' || session?.user?.role === 'Evaluator';

  useEffect(() => {
    if (hasPermission) {
      fetchPlaces();
    }
  }, [hasPermission]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/places');
      const data = await response.json();
      
      if (data.success) {
        setPlaces(data.data);
      } else {
        console.error('Failed to fetch places:', data.error);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (place, action) => {
    setSelectedPlace(place);
    setApprovalAction(action);
    setRejectionReason('');
    setShowApprovalDialog(true);
  };

  const confirmApproval = async () => {
    if (approvalAction === 'reject' && !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch('/api/places/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeId: selectedPlace._id,
          action: approvalAction,
          rejectionReason: rejectionReason.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the places list
        setPlaces(places.map(place => 
          place._id === selectedPlace._id ? data.data : place
        ));
        setShowApprovalDialog(false);
        alert(`Place ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Failed to process approval');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 text-center">
              You don't have permission to access this page. Only Admin and Evaluator users can approve places.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading places...</p>
        </div>
      </div>
    );
  }

  const pendingPlaces = places.filter(place => place.approvalStatus === 'pending');
  const approvedPlaces = places.filter(place => place.approvalStatus === 'approved');
  const rejectedPlaces = places.filter(place => place.approvalStatus === 'rejected');

  const PlaceCard = ({ place, showActions = false }) => (
    <Card key={place._id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{place.name}</CardTitle>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {place.location.city}, {place.location.state}
            </p>
          </div>
          {getStatusBadge(place.approvalStatus)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Deity: {place.deity}</p>
            <p className="text-sm text-gray-600">Architecture: {place.architecture}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 line-clamp-2">{place.about}</p>
          </div>

          {place.createdBy && (
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-1" />
              Created by: {place.createdBy.name} ({place.createdBy.role})
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            Created: {formatDate(place.createdAt)}
          </div>

          {place.approvedBy && place.approvedAt && (
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-1" />
              {place.approvalStatus === 'approved' ? 'Approved' : 'Processed'} by: {place.approvedBy.name} on {formatDate(place.approvedAt)}
            </div>
          )}

          {place.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
              <p className="text-sm text-red-700">{place.rejectionReason}</p>
            </div>
          )}

          {showActions && place.approvalStatus === 'pending' && (
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                onClick={() => handleApprovalAction(place, 'approve')}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleApprovalAction(place, 'reject')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Place Approvals</h1>
        <p className="text-gray-600 mt-2">
          Review and approve place submissions from Support Admin users
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPlaces.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedPlaces.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedPlaces.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingPlaces.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedPlaces.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedPlaces.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          {pendingPlaces.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
                <p className="text-gray-600">All places have been reviewed.</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {pendingPlaces.map(place => (
                <PlaceCard key={place._id} place={place} showActions={true} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          {approvedPlaces.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Approved Places</h3>
                <p className="text-gray-600">No places have been approved yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {approvedPlaces.map(place => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          {rejectedPlaces.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Rejected Places</h3>
                <p className="text-gray-600">No places have been rejected.</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {rejectedPlaces.map(place => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approve Place' : 'Reject Place'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">
                Are you sure you want to {approvalAction} "{selectedPlace?.name}"?
              </p>
            </div>

            {approvalAction === 'reject' && (
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this place..."
                  rows={3}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowApprovalDialog(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmApproval}
                disabled={processing}
                className={approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                variant={approvalAction === 'reject' ? 'destructive' : 'default'}
              >
                {processing ? 'Processing...' : (approvalAction === 'approve' ? 'Approve' : 'Reject')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}