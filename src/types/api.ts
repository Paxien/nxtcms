import { User } from './common'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  user: User
  token: string
}

export type ApiError = {
  code: string
  message: string
  details?: Record<string, string[]>
}

export type ValidationError = {
  field: string
  message: string
}
