import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Place from '../../../../models/Place';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET - Fetch a single place by slug
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Place slug is required'
      }, { status: 400 });
    }
    
    const place = await Place.findOne({ slug });
    
    if (!place) {
      return NextResponse.json({
        success: false,
        error: 'Place not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: place
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching place:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch place'
    }, { status: 500 });
  }
}

// PUT - Update a place by slug
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = params;
    const body = await request.json();
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Place slug is required'
      }, { status: 400 });
    }
    
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
    } = body;
    
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
      slug: { $ne: slug },
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
    
    // Create update data
    const updateData = {
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
    
    const updatedPlace = await Place.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPlace) {
      return NextResponse.json({
        success: false,
        error: 'Place not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Place updated successfully',
      data: updatedPlace
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating place:', error);
    
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
      error: 'Failed to update place'
    }, { status: 500 });
  }
}

// DELETE - Delete a place by slug
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Place slug is required'
      }, { status: 400 });
    }
    
    const deletedPlace = await Place.findOneAndDelete({ slug });
    
    if (!deletedPlace) {
      return NextResponse.json({
        success: false,
        error: 'Place not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Place deleted successfully',
      data: deletedPlace
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting place:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete place'
    }, { status: 500 });
  }
}