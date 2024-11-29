import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = signupSchema.parse(body)

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Here you would typically save the user to your database
    // For now, we'll just return success
    return NextResponse.json(
      { message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
