import { PasswordResetForm } from '@/components/password-reset-form'

export default function PasswordResetPage({ searchParams }: { searchParams: { token: string; email: string } }) {
  const { token, email } = searchParams

  return (
    <div className="sm:shadow-xl p-8 sm:bg-white rounded-xl space-y-8">
      <h1 className="font-semibold text-2xl">Reset Password</h1>
      <PasswordResetForm token={token} email={email} />
    </div>
  )
}
