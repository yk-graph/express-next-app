'use client'

import { useRouter } from 'next/navigation'
import { signIn, signOut } from 'next-auth/react'

export const Header = () => {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push('/')}>
        ExpressNextApp
      </h1>
      <div className="flex items-center gap-x-4">
        <button className="px-4 py-2 text-sm" onClick={() => router.push('/users')}>
          Users
        </button>

        <button className="px-4 py-2 text-sm" onClick={() => router.push('/profile')}>
          Profile
        </button>

        <button className="px-4 py-2 text-sm border border-slate-600 rounded-md" onClick={() => signOut()}>
          Sign out
        </button>

        <button className="px-4 py-2 text-sm border border-slate-600 rounded-md" onClick={() => signIn()}>
          Sign in
        </button>
      </div>
    </header>
  )
}
