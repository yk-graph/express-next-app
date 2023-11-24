import Link from 'next/link'

import { RegisterForm } from '@/components/register-form'

export default function RegisterPage() {
  return (
    <div className="sm:shadow-xl p-8 sm:bg-white rounded-xl space-y-8">
      <h1 className="font-semibold text-2xl">Create your Account</h1>
      <RegisterForm />
      <p className="text-center">
        Have an account?{' '}
        <Link className="text-indigo-500 hover:underline" href="/login">
          Sign in
        </Link>{' '}
      </p>
    </div>
  )
}
