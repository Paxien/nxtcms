'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

interface AuthContextType {
  user: {
    id: string
    username: string
    role: string
  } | null
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, logout, checkAuth, isLoading: storeLoading } = useAuthStore()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth()
      } catch (error) {
        console.error('Auth initialization failed:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initAuth()
  }, [checkAuth])

  const value = useMemo(
    () => ({
      user,
      logout,
      isLoading: isInitializing || storeLoading,
    }),
    [user, logout, isInitializing, storeLoading]
  )

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
