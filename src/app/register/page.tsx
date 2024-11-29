import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Create account',
  description: 'Create a new account',
}

export default function RegisterPage() {
  return (
    <main className="container max-w-screen-xl mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <RegisterForm />
    </main>
  )
}
