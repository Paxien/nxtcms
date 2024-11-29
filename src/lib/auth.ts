import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { config } from './config'

const JWT_SECRET = new TextEncoder().encode(config.JWT_SECRET)

export interface JWTPayload {
  sub: string
  username: string
  role: string
  iat: number
  exp: number
}

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + parseInt(config.JWT_EXPIRES_IN.replace('d', '')) * 24 * 60 * 60 // Convert days to seconds

  return new SignJWT({ ...payload, iat, exp })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    // Validate the payload has required fields
    if (
      typeof payload.sub !== 'string' ||
      typeof payload.username !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      throw new Error('Invalid token payload')
    }
    return {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
      iat: payload.iat!,
      exp: payload.exp!,
    }
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export async function getSession(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) return null
    return await verifyToken(token)
  } catch {
    return null
  }
}

export async function setSession(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const token = await signToken(payload)
  const cookieStore = await cookies()
  
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(Date.now() + parseInt(config.JWT_EXPIRES_IN.replace('d', '')) * 24 * 60 * 60 * 1000),
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}
