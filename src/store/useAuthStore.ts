import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  role: string
}

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  error: string | null
  login: (token: string, user: User) => void
  logout: () => Promise<void>
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      login: (token, user) => {
        set({ token, user, error: null })
        // Refresh the auth state after login
        setTimeout(() => {
          useAuthStore.getState().checkAuth()
        }, 0)
      },
      logout: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Logout failed')
          }
          
          set({ token: null, user: null, error: null, isLoading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Logout failed'
          set({ error: errorMessage, isLoading: false })
          throw error
        }
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      checkAuth: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include',
            headers: {
              'Cache-Control': 'no-cache',
            },
          })
          if (!response.ok) {
            throw new Error('Not authenticated')
          }
          const data = await response.json()
          set({ user: data.user, token: data.token || 'dummy-token', error: null })
        } catch (error) {
          set({ user: null, token: null, error: error instanceof Error ? error.message : 'Failed to authenticate' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
