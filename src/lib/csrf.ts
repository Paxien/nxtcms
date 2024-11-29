import { randomBytes, createHmac } from 'crypto'

const SECRET = process.env.CSRF_SECRET || 'your-csrf-secret-key'
const TOKEN_LENGTH = 32
const EXPIRY = 3600000 // 1 hour

interface TokenData {
  token: string
  timestamp: number
}

const tokens = new Map<string, number>()

export async function generateToken(): Promise<string> {
  const buffer = randomBytes(TOKEN_LENGTH)
  const token = buffer.toString('hex')
  const timestamp = Date.now()
  
  tokens.set(token, timestamp)
  
  // Clean up old tokens
  for (const [key, time] of tokens.entries()) {
    if (Date.now() - time > EXPIRY) {
      tokens.delete(key)
    }
  }
  
  return token
}

export async function verifyToken(token: string): Promise<boolean> {
  const timestamp = tokens.get(token)
  if (!timestamp) return false
  
  const isValid = Date.now() - timestamp < EXPIRY
  if (!isValid) {
    tokens.delete(token)
    return false
  }
  
  return true
}

export function generateHash(data: string): string {
  return createHmac('sha256', SECRET)
    .update(data)
    .digest('hex')
}
