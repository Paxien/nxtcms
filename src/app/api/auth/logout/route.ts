import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { clearSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Clear server-side session
    await clearSession()

    // Create a response that clears client-side cookies
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, no-transform',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )

    // Explicitly clear ALL authentication-related cookies
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
  } catch (error) {
    console.error('Comprehensive logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout completely' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: {
        'Allow': 'POST'
      }
    }
  )
}
