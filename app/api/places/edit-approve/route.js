import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Place from '../../../../models/Place';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// POST - Update place data and optionally approve it
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Check if user has permission to approve places
    if (!['Admin', 'Evaluator'].includes(session.user.role)) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions'
      }, { status: 403 });
    }

    await connectDB();
    
    const body = await request.json();
    const { 
      placeId,
      action, // 'save' or 'approve'
      placeData,
      rejectionReason
    } = body;

    if (!placeId) {
      return NextResponse.json({
        success: false,
        error: 'Place ID is required'
      }, { status: 400 });
    }

    if (!action || !['save', 'approve', 'reject'].includes(action)) {
      return NextResponse.json({
        success: false,
        error: 'Valid action is required (save, approve, or reject)'
      }, { status: 400 });
    }

    // Find the place
    const place = await Place.findById(placeId);
    if (!place) {
      return NextResponse.json({
        success: false,
        error: 'Place not found'
      }, { status: 404 });
    }

    let updateData = {};

    // If we have place data, validate and prepare it for update
    if (placeData) {
      const { 
        name, 
        deity, 
        state, 
        city, 
        district, 
        pincode,
        architecture, 
        about, 
        builtBy, 
        constructionPeriod, 
        significance, 
        phone, 
        website, 
        mapsLink, 
        image, 
        festivals 
      } = placeData;

      // Validate required fields
      if (!name || !deity || !state || !city || !pincode || !architecture || !about) {
        return NextResponse.json({
          success: false,
          error: 'Name, deity, state, city, pincode, architecture, and about are required fields'
        }, { status: 400 });
      }

      // Validate pincode format
      if (!/^\d{6}$/.test(pincode)) {
        return NextResponse.json({
          success: false,
          error: 'Pincode must be exactly 6 digits'
        }, { status: 400 });
      }

      // Check if another place with the same name exists in the same location (excluding current place)
      const existingPlace = await Place.findOne({
        _id: { $ne: placeId },
        name: name.trim(),
        'location.city': city.trim(),
        'location.state': state.trim()
      });

      if (existingPlace) {
        return NextResponse.json({
          success: false,
          error: 'A place with this name already exists in the same city and state'
        }, { status: 409 });
      }

      // Prepare update data
      updateData = {
        name: name.trim(),
        deity: deity.trim(),
        location: {
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          ...(district && { district: district.trim() })
        },
        architecture: architecture.trim(),
        about: about.trim(),
        ...(builtBy && { builtBy: builtBy.trim() }),
        ...(constructionPeriod && { constructionPeriod: constructionPeriod.trim() }),
        ...(significance && { significance: significance.trim() }),
        contact: {
          ...(phone && { phone: phone.trim() }),
          ...(website && { website: website.trim() })
        },
        ...(mapsLink && { mapsLink: mapsLink.trim() }),
        ...(image && { image: image.trim() }),
        festivals: festivals ? festivals.filter(f => f.name && f.period && f.description) : []
      };
    }

    // Handle approval/rejection logic
    if (action === 'approve') {
      updateData.approvalStatus = 'approved';
      updateData.approvedBy = session.user.id;
      updateData.approvedAt = new Date();
      updateData.rejectionReason = undefined; // Clear any previous rejection reason
    } else if (action === 'reject') {
      if (!rejectionReason || !rejectionReason.trim()) {
        return NextResponse.json({
          success: false,
          error: 'Rejection reason is required'
        }, { status: 400 });
      }
      updateData.approvalStatus = 'rejected';
      updateData.approvedBy = session.user.id;
      updateData.approvedAt = new Date();
      updateData.rejectionReason = rejectionReason.trim();
    }
    // For 'save' action, we don't change approval status

    const updatedPlace = await Place.findByIdAndUpdate(
      placeId,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email role')
     .populate('approvedBy', 'name email role');

    if (!updatedPlace) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update place'
      }, { status: 500 });
    }

    let message = 'Place updated successfully';
    if (action === 'approve') {
      message = 'Place updated and approved successfully';
    } else if (action === 'reject') {
      message = 'Place updated and rejected successfully';
    }

    return NextResponse.json({
      success: true,
      message,
      data: updatedPlace
    }, { status: 200 });

  } catch (error) {
    console.error('Error in edit-approve:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'A place with this name already exists in the same location'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 });
  }
}