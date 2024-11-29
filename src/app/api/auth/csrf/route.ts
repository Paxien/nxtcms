import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { generateToken, verifyToken } from '@/lib/csrf'

export async function GET() {
  const token = await generateToken()
  return NextResponse.json({ token })
}

export async function POST() {
  const headersList = headers()
  const token = headersList.get('x-csrf-token')

  if (!token) {
    return NextResponse.json(
      { error: 'CSRF token missing' },
      { status: 400 }
    )
  }

  const isValid = await verifyToken(token)
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 400 }
    )
  }

  return NextResponse.json({ valid: true })
}
