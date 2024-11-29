'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerSchema } from '@/lib/validations/auth'
import { Form } from '@/components/forms/Form'
import { FormField } from '@/components/forms/FormField'

type RegisterData = {
  username: string
  password: string
  confirmPassword: string
}

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: RegisterData) {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to register')
      }

      // After successful registration, redirect to profile page
      router.push('/profile')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to register')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-gray-500">
          Enter your details to create your account
        </p>
      </div>

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <FormField
          name="username"
          label="Username"
          type="text"
          placeholder="Choose a username"
          disabled={isSubmitting}
        />

        <FormField
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          disabled={isSubmitting}
        />

        <FormField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          disabled={isSubmitting}
        />

        {error && (
          <div className="bg-red-50 text-red-900 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </Form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
