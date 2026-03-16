// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define route types
const routeMaps = {
  // Routes that require authentication
  protected: ['/admin', '/dashboard', '/owner', '/franchisee'],
  // Routes that should redirect to dashboard if already authenticated
  auth: ['/login', '/signup', '/forgot-password'],
  // Public routes (no auth required, no redirect if authenticated)
  public: ['/', '/home', '/about', '/contact'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for token
  const token = request.cookies.get('token')?.value;
  let user = null;
  
  if (token) {
    try {
      user = verify(token, JWT_SECRET);
    } catch (error) {
      // Invalid token - will be treated as not authenticated
    }
  }

  // Check if path is public (no redirects needed)
  if (routeMaps.public.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if path is auth route (login/signup/forgot)
  if (routeMaps.auth.some(route => pathname.startsWith(route))) {
    if (user) {
      // Already logged in - redirect to appropriate dashboard
      const role = (user as any).role;
      return NextResponse.redirect(new URL(getDashboardByRole(role), request.url));
    }
    // Not logged in - allow access to auth page
    return NextResponse.next();
  }

  // Check if path is protected
  if (routeMaps.protected.some(route => pathname.startsWith(route))) {
    if (!user) {
      // Not logged in - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check role-based access
    const userRole = (user as any).role;
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL(getDashboardByRole(userRole), request.url));
    }
    if (pathname.startsWith('/owner') && userRole !== 'owner') {
      return NextResponse.redirect(new URL(getDashboardByRole(userRole), request.url));
    }
    if (pathname.startsWith('/franchisee') && userRole !== 'franchisee') {
      return NextResponse.redirect(new URL(getDashboardByRole(userRole), request.url));
    }
    
    // All good
    return NextResponse.next();
  }

  // Default: allow request
  return NextResponse.next();
}

function getDashboardByRole(role: string): string {
  switch (role) {
    case 'admin': return '/admin';
    case 'owner': return '/owner/dashboard';
    case 'franchisee': return '/franchisee/dashboard';
    default: return '/dashboard';
  }
}

// Configure which routes trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};