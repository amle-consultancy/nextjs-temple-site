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
  AlertCircle,
  Edit,
  Save
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ApprovalsPage() {
  const { data: session } = useSession();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [festivals, setFestivals] = useState([]);

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

  const handleEditAndApprove = async (place) => {
    setSelectedPlace(place);
    setEditFormData({
      name: place.name || '',
      deity: place.deity || '',
      state: place.location?.state || '',
      city: place.location?.city || '',
      district: place.location?.district || '',
      pincode: place.location?.pincode || '',
      architecture: place.architecture || '',
      about: place.about || '',
      builtBy: place.builtBy || '',
      constructionPeriod: place.constructionPeriod || '',
      significance: place.significance || '',
      phone: place.contact?.phone || '',
      website: place.contact?.website || '',
      mapsLink: place.mapsLink || '',
      image: place.image || ''
    });
    setFestivals(place.festivals || []);
    setShowEditDialog(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFestival = () => {
    setFestivals(prev => [...prev, { name: '', period: '', description: '' }]);
  };

  const updateFestival = (index, field, value) => {
    setFestivals(prev => prev.map((festival, i) => 
      i === index ? { ...festival, [field]: value } : festival
    ));
  };

  const removeFestival = (index) => {
    setFestivals(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (action) => {
    // Validation
    if (!editFormData.name?.trim() || !editFormData.deity?.trim() || 
        !editFormData.state?.trim() || !editFormData.city?.trim() || 
        !editFormData.pincode?.trim() || !editFormData.architecture?.trim() || 
        !editFormData.about?.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!/^\d{6}$/.test(editFormData.pincode)) {
      alert('Pincode must be exactly 6 digits');
      return;
    }

    // Show confirmation dialog
    const actionText = action === 'save' ? 'save changes to' : 'save and approve';
    
    if (!confirm(`Are you sure you want to ${actionText} "${editFormData.name}"?`)) {
      return;
    }

    try {
      setProcessing(true);
      
      const requestData = {
        placeId: selectedPlace._id,
        action: action,
        placeData: {
          ...editFormData,
          festivals: festivals.filter(f => f.name && f.period && f.description)
        }
      };

      const response = await fetch('/api/places/edit-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (data.success) {
        setPlaces(places.map(place => 
          place._id === selectedPlace._id ? data.data : place
        ));
        setShowEditDialog(false);
        alert(data.message);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error processing edit:', error);
      alert('Failed to process request');
    } finally {
      setProcessing(false);
    }
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
            <div className="flex gap-2 pt-2 flex-wrap">
              <Button 
                size="sm" 
                onClick={() => handleEditAndApprove(place)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit & Approve
              </Button>
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

      {/* Edit and Approve Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Place Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Temple/Place Name *</Label>
                <Input
                  id="name"
                  value={editFormData.name || ''}
                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                  placeholder="Enter temple/place name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deity">Deity *</Label>
                <Input
                  id="deity"
                  value={editFormData.deity || ''}
                  onChange={(e) => handleEditFormChange('deity', e.target.value)}
                  placeholder="Enter deity name"
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={editFormData.state || ''}
                    onChange={(e) => handleEditFormChange('state', e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={editFormData.city || ''}
                    onChange={(e) => handleEditFormChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={editFormData.district || ''}
                    onChange={(e) => handleEditFormChange('district', e.target.value)}
                    placeholder="Enter district"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={editFormData.pincode || ''}
                    onChange={(e) => handleEditFormChange('pincode', e.target.value)}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Temple Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Temple Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="architecture">Architecture *</Label>
                  <Input
                    id="architecture"
                    value={editFormData.architecture || ''}
                    onChange={(e) => handleEditFormChange('architecture', e.target.value)}
                    placeholder="Enter architecture style"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="builtBy">Built By</Label>
                  <Input
                    id="builtBy"
                    value={editFormData.builtBy || ''}
                    onChange={(e) => handleEditFormChange('builtBy', e.target.value)}
                    placeholder="Enter who built it"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="constructionPeriod">Construction Period</Label>
                  <Input
                    id="constructionPeriod"
                    value={editFormData.constructionPeriod || ''}
                    onChange={(e) => handleEditFormChange('constructionPeriod', e.target.value)}
                    placeholder="Enter construction period"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about">About *</Label>
                <Textarea
                  id="about"
                  value={editFormData.about || ''}
                  onChange={(e) => handleEditFormChange('about', e.target.value)}
                  placeholder="Enter description about the place"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="significance">Significance</Label>
                <Textarea
                  id="significance"
                  value={editFormData.significance || ''}
                  onChange={(e) => handleEditFormChange('significance', e.target.value)}
                  placeholder="Enter significance of the place"
                  rows={3}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editFormData.phone || ''}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={editFormData.website || ''}
                    onChange={(e) => handleEditFormChange('website', e.target.value)}
                    placeholder="Enter website URL"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mapsLink">Maps Link</Label>
                <Input
                  id="mapsLink"
                  value={editFormData.mapsLink || ''}
                  onChange={(e) => handleEditFormChange('mapsLink', e.target.value)}
                  placeholder="Enter Google Maps link"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={editFormData.image || ''}
                  onChange={(e) => handleEditFormChange('image', e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
            </div>

            {/* Festivals */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Festivals</h3>
                <Button type="button" onClick={addFestival} size="sm">
                  Add Festival
                </Button>
              </div>
              
              {festivals.map((festival, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Festival {index + 1}</h4>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeFestival(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Festival Name</Label>
                      <Input
                        value={festival.name || ''}
                        onChange={(e) => updateFestival(index, 'name', e.target.value)}
                        placeholder="Enter festival name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Period</Label>
                      <Input
                        value={festival.period || ''}
                        onChange={(e) => updateFestival(index, 'period', e.target.value)}
                        placeholder="Enter festival period"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={festival.description || ''}
                      onChange={(e) => updateFestival(index, 'description', e.target.value)}
                      placeholder="Enter festival description"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleEditSubmit('save')}
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-1" />
                {processing ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                onClick={() => handleEditSubmit('approve')}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {processing ? 'Processing...' : 'Save & Approve'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}