import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'

// Add paths that don't require authentication
const publicPaths = [
  '/',              // Main page
  '/login',         // Login page
  '/signup',        // Signup page
  '/api/auth',      // Auth API routes
  '/contact',       // Contact page
  '/about',         // About page
  '/_next',         // Next.js assets
  '/favicon.ico',   // Favicon
]

// Add paths that require authentication
const protectedPaths = [
  '/profile',       // Profile page
  '/dashboard',     // Dashboard
  '/settings',      // Settings
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if current path requires authentication
  const requiresAuth = protectedPaths.some(path => pathname.startsWith(path))
  if (!requiresAuth) {
    return NextResponse.next()
  }

  // Check authentication for protected paths
  const session = await getSession(request)
  if (!session) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    
    // Aggressively clear all potential authentication cookies
    const cookiesToClear = ['auth-token', 'user', 'session', 'token']
    cookiesToClear.forEach(cookieName => {
      response.cookies.delete(cookieName)
      response.cookies.set(cookieName, '', { 
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    })

    return response
  }

  // Add user info to headers for API routes
  if (pathname.startsWith('/api')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', session.sub)
    requestHeaders.set('x-user-role', session.role)
    requestHeaders.set('x-username', session.username)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

// Update matcher to exclude static files and images
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
