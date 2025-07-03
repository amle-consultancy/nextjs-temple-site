import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import User from '../../../models/User';
import { authOptions } from '../auth/[...nextauth]/route';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET - Fetch all users
export async function GET() {
  try {
    await connectDB();
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }
    
    // Only Admin can view all users
    if (session.user.role !== 'Admin') {
      return NextResponse.json({
        success: false,
        error: 'Access denied. Only Admin users can view users list.'
      }, { status: 403 });
    }
    
    const users = await User.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: users
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 });
  }
}

// POST - Create a new user
export async function POST(request) {
  try {
    await connectDB();
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }
    
    // Only Admin can create users
    if (session.user.role !== 'Admin') {
      return NextResponse.json({
        success: false,
        error: 'Access denied. Only Admin users can create users.'
      }, { status: 403 });
    }
    
    const body = await request.json();
    const { name, email, password, mobile, role, address } = body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, password, and role are required fields'
      }, { status: 400 });
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 409 });
    }
    
    // Create new user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      ...(mobile && { mobile: mobile.trim() }),
      ...(address && { address: address.trim() })
    };
    
    const user = new User(userData);
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: user
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 });
    }
    
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create user'
    }, { status: 500 });
  }
}