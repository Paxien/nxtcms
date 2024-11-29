export const APP_NAME = 'My App'
export const APP_DESCRIPTION = 'Next.js application with TypeScript'
export const APP_VERSION = '1.0.0'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
export const API_TIMEOUT = 10000 // 10 seconds

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const
