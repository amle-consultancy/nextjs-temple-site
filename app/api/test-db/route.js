import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to database',
      details: error.message
    }, { status: 500 });
  }
}