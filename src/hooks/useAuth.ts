'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { fetchAPI } from '@/lib/api/client'

interface LoginData {
  username: string
  password: string
}

interface RegisterData extends LoginData {
  confirmPassword: string
}

interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
    role: string
  }
}

export function useAuth() {
  const router = useRouter()
  const { login, logout, setLoading, setError } = useAuthStore()

  const handleLogin = useCallback(
    async (data: LoginData) => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchAPI<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(data),
        })
        login(response.token, response.user)
        router.push('/profile') // Changed from /dashboard to /profile
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Login failed')
      } finally {
        setLoading(false)
      }
    },
    [login, router, setError, setLoading]
  )

  const handleRegister = useCallback(
    async (data: RegisterData) => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchAPI<AuthResponse>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(data),
        })
        login(response.token, response.user)
        router.push('/profile') // Changed from /dashboard to /profile
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Registration failed')
      } finally {
        setLoading(false)
      }
    },
    [login, router, setError, setLoading]
  )

  const handleLogout = useCallback(async () => {
    try {
      await fetchAPI('/api/auth/logout', { method: 'POST' })
      logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [logout, router])

  return {
    handleLogin,
    handleRegister,
    handleLogout,
  }
}
