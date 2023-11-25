'use client'

import { FC } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signOut } from 'next-auth/react'

import type { User } from '@/types/user'

interface Props {
  currentUser: User | null
}

export const Header: FC<Props> = ({ currentUser }) => {
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

        {currentUser ? (
          <button className="px-4 py-2 text-sm border border-slate-600 rounded-md" onClick={() => signOut()}>
            Sign out
          </button>
        ) : (
          <>
            <button className="px-4 py-2 text-sm border border-slate-600 rounded-md" onClick={() => signIn()}>
              Sign in
            </button>

            <button
              className="px-4 py-2 text-sm border border-slate-600 rounded-md"
              onClick={() => router.push('/register')}
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>
  )
}
