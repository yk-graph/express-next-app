import Link from 'next/link'

import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="sm:shadow-xl p-8 sm:bg-white rounded-xl space-y-8">
      <h1 className="font-semibold text-2xl">Login</h1>
      <LoginForm />
      <div className="space-y-2">
        <p className="text-center">
          Need to create an account?{' '}
          <Link className="text-indigo-500 hover:underline" href="/register">
            Create Account
          </Link>{' '}
        </p>
        <p className="text-center">
          Forgot password?{' '}
          <Link className="text-indigo-500 hover:underline" href="/forgot-password">
            Reset Password
          </Link>{' '}
        </p>
      </div>
    </div>
  )
}
