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

// Helper function to clear localStorage
const clearPersistentStorage = () => {
  try {
    localStorage.removeItem('auth-storage')
    localStorage.removeItem('persist:auth-storage')
    
    // Additional cleanup for any related storage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('auth') || key.includes('token') || key.includes('user')) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing persistent storage:', error)
  }
}

// Create the store with persist middleware
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Initialize the base state and methods
      const baseState = {
        token: null,
        user: null,
        isLoading: false,
        error: null,
      }

      // Create a function to reset state while preserving methods
      const resetState = () => {
        const currentState = get()
        return {
          ...baseState,
          login: currentState.login,
          logout: currentState.logout,
          setLoading: currentState.setLoading,
          setError: currentState.setError,
          checkAuth: currentState.checkAuth,
        }
      }

      return {
        ...baseState,
        login: (token: string, user: User) => {
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
            
            // Clear persistent storage
            clearPersistentStorage()
            
            // Reset state while preserving methods
            set(resetState())

            // Redirect to home or login page
            window.location.href = '/'
          } catch (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Logout failed'
            
            // Reset state while preserving methods and setting error
            set({
              ...resetState(),
              error: errorMessage,
            })
            
            console.error('Logout error:', errorMessage)
          }
        },
        setLoading: (isLoading: boolean) => set({ isLoading }),
        setError: (error: string | null) => set({ error }),
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
      }
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)
