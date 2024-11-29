'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  username: string
  role: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (!mounted) return

        if (response.ok) {
          setUser(data.user)
          setError(null)
        } else {
          // Only redirect if we get a 401 (Unauthorized)
          if (response.status === 401) {
            router.push('/login')
          }
          setError(data.message)
        }
      } catch (error) {
        if (!mounted) return
        setError('Failed to fetch user profile')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [router])

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show error state (but don't redirect automatically)
  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-900 rounded-lg p-4">
          {error}
        </div>
      </div>
    )
  }

  // Only render profile if we have user data
  if (!user) {
    return null
  }

  return (
    <main className="container max-w-screen-xl mx-auto p-4">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-8">
            <div className="h-24 w-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl text-blue-600">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.username}!</h1>
            <p className="text-green-600 mt-2">Successfully signed in</p>
          </div>

          <div className="space-y-4">
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/auth/logout', { method: 'POST' })
                    router.push('/login')
                  } catch (error) {
                    console.error('Logout failed:', error)
                  }
                }}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
