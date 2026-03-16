// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  // Public paths (no auth required)
  const publicPaths = ['/login', '/signup', '/forgot-password', '/', '/home']
  const isPublicPath = publicPaths.includes(pathname)

  // Auth paths (only for non-authenticated users)
  const authPaths = ['/login', '/signup', '/forgot-password']
  const isAuthPath = authPaths.includes(pathname)

  // If no session and trying to access protected route
  if (!session && !isPublicPath) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If has session and trying to access auth pages (login/signup/forgot)
  if (session && isAuthPath) {
    // Get user role from metadata
    const role = session.user.user_metadata?.role || 'client'
    
    // Redirect based on role
    const redirectUrl = getRoleBasedRedirect(role)
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }

  // If has session and trying to access admin but is not admin
  if (session && pathname.startsWith('/admin')) {
    const role = session.user.user_metadata?.role || 'client'
    
    // Only admin can access admin panel
    if (role !== 'admin') {
      const redirectUrl = getRoleBasedRedirect(role)
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }
  }

  // If has session and trying to access client dashboard but is not client
  if (session && pathname.startsWith('/dashboard')) {
    const role = session.user.user_metadata?.role || 'client'
    
    // Only clients access client dashboard
    if (role !== 'client') {
      const redirectUrl = getRoleBasedRedirect(role)
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }
  }

  return res
}

// Helper function to get redirect path based on role
function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'owner':
      return '/owner/dashboard'
    case 'franchisee':
      return '/franchisee/dashboard'
    case 'client':
    default:
      return '/dashboard'
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}