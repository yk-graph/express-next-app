import Link from 'next/link'

import { SendEmailForm } from '@/components/send-email-form'

export default function ForgotPasswordPage() {
  return (
    <div className="sm:shadow-xl p-8 sm:bg-white rounded-xl space-y-8">
      <h1 className="font-semibold text-2xl">Reset Password</h1>
      <SendEmailForm />
      <p className="text-center">
        Have an account?{' '}
        <Link className="text-indigo-500 hover:underline" href="/login">
          Sign in
        </Link>{' '}
      </p>
    </div>
  )
}
