// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  // Public paths
  const publicPaths = ['/login', '/signup', '/forgot-password', '/']
  const isPublicPath = publicPaths.includes(pathname)

  if (!session && !isPublicPath) {
    // Redirect to login if no session and trying to access protected route
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (session && isPublicPath) {
    // Redirect to admin if logged in and trying to access public route
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
