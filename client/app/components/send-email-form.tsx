'use client'

import { useState } from 'react'

import axiosInstance from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const SendEmailForm = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await axiosInstance.post('/auth/forgot-password', {
        email,
      })

      if (res.status === 200) {
        setStatus(true)
        setError('メールアドレスにパスワードリセット用のリンクを送りました。24時間以内にご確認ください')
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
        <Label htmlFor="email">Email</Label>
        <Input
          className="w-full"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          type="email"
        />
      </div>
      <div className="w-full">
        <Button className="w-full" size="lg">
          {status ? 'OK!' : 'Send Email'}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  )
}
