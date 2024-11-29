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
    (set, get, api) => ({
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
        set({ isLoading: true, error: null })
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
          
          // Completely reset and clear persisted state
          api.setState({ 
            token: null, 
            user: null, 
            isLoading: false, 
            error: null 
          })
          
          // Destroy the entire persisted storage
          api.destroy()

          // Redirect to home or login page
          window.location.href = '/'
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Logout failed'
          
          // Ensure state is cleared even on error
          api.setState({ 
            token: null, 
            user: null, 
            isLoading: false, 
            error: errorMessage 
          })
          
          console.error('Logout error:', errorMessage)
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
          set({ 
            user: data.user, 
            token: data.token, 
            isLoading: false,
            error: null 
          })
        } catch (error) {
          set({ 
            user: null, 
            token: null, 
            isLoading: false,
            error: 'Authentication failed' 
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)
