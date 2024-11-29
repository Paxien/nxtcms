import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Sign in',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <main className="container max-w-screen-xl mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <LoginForm />
    </main>
  )
}
