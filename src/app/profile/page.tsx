'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, logout } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Failed to fetch profile')
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      setError('Failed to logout')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900/50 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            {/* Profile Header */}
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto flex items-center justify-center">
                <span className="text-4xl text-white uppercase">
                  {user.username[0]}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">
                {user.username}
              </h2>
              <p className="mt-1 text-sm text-gray-400 capitalize">{user.role}</p>
            </div>

            {/* Profile Info */}
            <div className="mt-8 border-t border-gray-700 pt-8">
              <dl className="space-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-400">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-200">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Username</dt>
                  <dd className="mt-1 text-sm text-gray-200">{user.username}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Role</dt>
                  <dd className="mt-1 text-sm text-gray-200 capitalize">
                    {user.role}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Actions */}
            <div className="mt-8 border-t border-gray-700 pt-8">
              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
