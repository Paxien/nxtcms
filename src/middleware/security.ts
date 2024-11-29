import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken, generateToken } from '@/lib/csrf'
import { sanitizeInput } from '@/lib/sanitization'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
})

// Paths that require CSRF protection
const protectedPaths = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
  '/api/user',
]

// Paths that require rate limiting
const rateLimitedPaths = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
]

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  )

  const { pathname } = request.nextUrl

  // Apply rate limiting for specific paths
  if (rateLimitedPaths.some(path => pathname.startsWith(path))) {
    const ip = request.ip ?? '127.0.0.1'
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)

    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', reset.toString())

    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: response.headers,
      })
    }
  }

  // Apply CSRF protection for specific paths
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const csrfToken = request.headers.get('x-csrf-token')
      
      if (!csrfToken) {
        return new NextResponse('Invalid CSRF token', { status: 403 })
      }

      try {
        const isValid = await verifyToken(csrfToken)
        if (!isValid) {
          return new NextResponse('Invalid or expired CSRF token', { status: 403 })
        }
      } catch {
        return new NextResponse('CSRF token verification failed', { status: 403 })
      }

      // Sanitize input for protected routes
      try {
        const body = await request.json()
        const sanitizedBody = sanitizeInput(body)
        request = new NextRequest(request.url, {
          body: JSON.stringify(sanitizedBody),
          headers: request.headers,
          method: request.method,
        })
      } catch {
        return new NextResponse('Invalid request body', { status: 400 })
      }
    } else if (request.method === 'GET') {
      // Generate new CSRF token for GET requests
      const token = await generateToken()
      response.headers.set('x-csrf-token', token)
    }
  }

  return response
}

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
