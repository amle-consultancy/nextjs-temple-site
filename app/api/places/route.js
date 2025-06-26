import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Place from '../../../models/Place';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET - Fetch all places
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const deity = searchParams.get('deity');
    const search = searchParams.get('search');
    
    let query = { isActive: true };
    
    // Build query based on filters
    if (state) {
      query['location.state'] = state;
    }
    if (city) {
      query['location.city'] = city;
    }
    if (deity) {
      query.deity = deity;
    }
    
    let places;
    if (search) {
      places = await Place.searchPlaces(search).sort({ createdAt: -1 });
    } else {
      places = await Place.find(query).sort({ createdAt: -1 });
    }
    
    return NextResponse.json({
      success: true,
      data: places,
      count: places.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch places'
    }, { status: 500 });
  }
}

// POST - Create a new place
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
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
    
    // Check if place already exists
    const existingPlace = await Place.findOne({
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
    
    // Create place data
    const placeData = {
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
    
    const place = new Place(placeData);
    await place.save();
    
    return NextResponse.json({
      success: true,
      message: 'Place created successfully',
      data: place
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating place:', error);
    
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
      error: 'Failed to create place'
    }, { status: 500 });
  }
}