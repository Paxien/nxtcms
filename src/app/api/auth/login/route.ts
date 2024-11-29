import { NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations/auth'
import { signToken } from '@/lib/auth'
import { verifyPassword } from '@/lib/crypto'
import { rateLimit } from '@/lib/rate-limit'
import { getUser } from '@/lib/storage'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(request: Request) {
  try {
    // Rate limiting
    await limiter.check(request, 5, 'LOGIN')

    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Get stored user data
    const userData = await getUser()
    if (!userData) {
      return NextResponse.json(
        { message: 'No user registered' },
        { status: 401 }
      )
    }

    // Check username
    if (validatedData.username !== userData.username) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(validatedData.password, userData.password)
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = await signToken({
      sub: '1',
      username: userData.username,
      role: 'user',
    })

    // Set the token in cookies and return response
    const response = NextResponse.json({
      user: {
        id: '1',
        username: userData.username,
        role: 'user',
      },
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
