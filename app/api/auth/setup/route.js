import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '../../../../models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    // Check if any admin users already exist
    const existingAdmin = await User.findOne({ 
      role: { $in: ['Admin', 'Support Admin'] } 
    });
    
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Admin user already exists'
      }, { status: 409 });
    }
    
    const body = await request.json();
    const { name, email, password } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, and password are required'
      }, { status: 400 });
    }
    
    // Create the first admin user
    const adminUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'Admin'
    });
    
    await adminUser.save();
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    
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
        error: 'User with this email already exists'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create admin user'
    }, { status: 500 });
  }
}