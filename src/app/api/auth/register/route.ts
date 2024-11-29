import { NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { signToken } from '@/lib/auth'
import { hashPassword } from '@/lib/crypto'
import { rateLimit } from '@/lib/rate-limit'
import { saveUser, getUser } from '@/lib/storage'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(request: Request) {
  try {
    // Rate limiting
    await limiter.check(request, 3, 'REGISTER')

    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if a user is already registered
    const existingUser = await getUser()
    if (existingUser) {
      return NextResponse.json(
        { message: 'A user is already registered' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await hashPassword(validatedData.password)

    // Save user data
    await saveUser({
      username: validatedData.username,
      password: hashedPassword,
    })

    // Generate JWT token
    const token = await signToken({
      sub: '1',
      username: validatedData.username,
      role: 'user',
    })

    // Set the token in cookies and return response
    const response = NextResponse.json({
      user: {
        id: '1',
        username: validatedData.username,
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
    console.error('Registration error:', error)
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
