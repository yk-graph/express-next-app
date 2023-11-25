'use client'

import { FC } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'

interface Props {
  user: {
    email: string
    password: string
  }
}

export const ActicateButton: FC<Props> = ({ user }) => {
  const router = useRouter()

  const onSubmit = async () => {
    const res = await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: user.password,
    })

    if (res?.ok) {
      router.push('/')
    }
  }

  return <Button onClick={onSubmit}>トップページへ</Button>
}
