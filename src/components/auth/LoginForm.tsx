'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginSchema } from '@/lib/validations/auth'
import { Form } from '@/components/forms/Form'
import { FormField } from '@/components/forms/FormField'
import { useAuthStore } from '@/store/useAuthStore'

type LoginData = {
  username: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, user } = useAuthStore()

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const returnUrl = searchParams.get('returnUrl') || '/profile'
      router.replace(returnUrl)
    }
  }, [user, router, searchParams])

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginData) {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to login')
      }

      const responseData = await response.json()
      
      // Update auth store with user data
      login(responseData.token, responseData.user)

      // Get return URL from query string or default to profile page
      const returnUrl = searchParams.get('returnUrl') || '/profile'
      router.replace(returnUrl)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to login')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Or{' '}
          <Link href="/signup" className="font-medium text-blue-500 hover:text-blue-400">
            create a new account
          </Link>
        </p>
      </div>

      <Form form={form} onSubmit={onSubmit}>
        {error && (
          <div className="rounded-md bg-red-500 bg-opacity-10 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <FormField
            name="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
            disabled={isSubmitting}
            required
          />

          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            disabled={isSubmitting}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </Form>
    </div>
  )
}
