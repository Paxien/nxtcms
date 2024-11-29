import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { message: 'Session expired, please login again' },
        { status: 401 }
      )
    }

    // Successfully retrieved user data
    return NextResponse.json({
      user: {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
      },
    })
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json(
      { message: 'Failed to verify authentication' },
      { status: 500 }
    )
  }
}
