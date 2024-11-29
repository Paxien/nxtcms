import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'

// Add paths that don't require authentication
const publicPaths = [
  '/',              // Main page
  '/login',         // Login page
  '/register',      // Register page
  '/api/auth',      // Auth API routes
  '/contact',       // Contact page
  '/about',         // About page (if you have one)
  '/_next',         // Next.js assets
  '/favicon.ico',   // Favicon
]

// Add paths that require authentication
const protectedPaths = [
  '/profile',       // Profile page
  '/dashboard',     // Dashboard (if you have one)
  '/settings',      // Settings (if you have one)
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
    response.cookies.delete('token')
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
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
