import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '../../../../models/User';
import mongoose from 'mongoose';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET - Fetch a single user by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 });
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: user
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user'
    }, { status: 500 });
  }
}

// DELETE - Delete a user by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 });
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    await User.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      data: { id }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user'
    }, { status: 500 });
  }
}

// PUT - Update a user by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 });
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Update user fields
    const allowedUpdates = ['name', 'email', 'mobile', 'role', 'address'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });
    
    // If email is being updated, check for duplicates
    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findByEmail(updates.email);
      if (existingUser) {
        return NextResponse.json({
          success: false,
          error: 'User with this email already exists'
        }, { status: 409 });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update user'
    }, { status: 500 });
  }
}