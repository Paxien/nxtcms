import { NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { signToken } from '@/lib/auth'
import { hashPassword } from '@/lib/crypto'
import { rateLimit } from '@/lib/rate-limit'

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

    // Hash the password
    const hashedPassword = await hashPassword(validatedData.password)

    // In a real application, you would want to use a more secure way to update environment variables
    // This is just for demonstration purposes
    process.env.AUTH_USERNAME = validatedData.username
    process.env.AUTH_PASSWORD = hashedPassword

    // Generate JWT token
    const token = await signToken({
      sub: '1',
      username: validatedData.username,
      role: 'user',
    })

    // Return user data and token
    return NextResponse.json({
      token,
      user: {
        id: '1',
        username: validatedData.username,
        role: 'user',
      },
    })
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
