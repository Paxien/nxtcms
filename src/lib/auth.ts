import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-me'
)

export interface JWTPayload {
  sub: string
  email: string
  role: string
  iat: number
  exp: number
}

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 60 * 60 * 24 * 7 // 7 days

  return new SignJWT({ ...payload, iat, exp })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function setSession(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const token = await signToken(payload)
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearSession() {
  cookies().delete('token')
}
