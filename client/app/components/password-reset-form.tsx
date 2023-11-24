'use client'

import { FC, useState } from 'react'
import { signIn } from 'next-auth/react'

import axiosInstance from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  email: string
  token: string
}

export const PasswordResetForm: FC<Props> = ({ email, token }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await axiosInstance.patch('/auth/password-reset', {
        token,
        email,
        password,
      })

      if (res.status === 200) {
        // 更新に成功したら、入力されたユーザー情報でログインしてトップページにリダイレクトする
        signIn('credentials', {
          email,
          password,
          callbackUrl: '/',
        })
      }
    } catch (error: any) {
      const res = error.response

      if (!res) {
        setError('Internal Server Error')
      } else {
        setError(`${res.status} ${res.data.msg}`)
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 w-full sm:w-[400px]">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          className="w-full"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          type="password"
        />
      </div>
      <div className="w-full">
        <Button className="w-full" size="lg">
          Reset Password
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  )
}
