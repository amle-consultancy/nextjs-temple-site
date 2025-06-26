import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Check if user has admin role
      const token = req.nextauth.token;
      
      if (!token) {
        // No token, redirect to login
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      
      // Check if user has admin role
      if (token.role !== 'Admin' && token.role !== 'Support Admin') {
        // User doesn't have admin role, redirect to unauthorized page
        return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith('/auth/')) {
          return true;
        }
        
        // For admin routes, require token
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }
        
        // Allow access to other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*'
  ]
};