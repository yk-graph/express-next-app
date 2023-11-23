'use client'

import { SessionProvider as Provider } from 'next-auth/react'

interface Props {
  children: React.ReactNode
}

export const SessionProvider = ({ children }: Props) => {
  return <Provider>{children}</Provider>
}
