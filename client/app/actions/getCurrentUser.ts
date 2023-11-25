/*
  ログインしているかどうかを判定してログインしている場合は現在のユーザー情報を取得して返却する
  1. getServerSession メソッドを使って現在の session 情報を取得する
  2. session 情報にユーザーの email 情報が含まれていなかったら未ログインとして判定
  3. DB の中にあるユーザーのユニークなデータである email 情報から session で返却されたユーザーの email の値と一致していて、かつ isActivated が true であるものをログインと判定して返却
  4. それ以外の場合は未ログインとして null を返却
*/

import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/next-auth-options'
import axiosInstance from '@/lib/axios'
import { User } from '@/types/user'

// ログインしているかどうかを判定して返却する処理
export default async function getCurrentUser(): Promise<User | null> {
  try {
    // next-authのgetServerSessionメソッドを使って現在のsession情報を取得する処理
    const session = await getServerSession(authOptions)

    // session情報にユーザーのemail情報が含まれていなかったら未ログインとして判定
    if (!session?.user?.email) {
      return null
    }

    // DBの中になるユーザーのユニークなデータであるemail情報からsessionで返却されたユーザーのemailの値と一致するものを探して返却
    const { data: currentUser } = await axiosInstance.get('/me', {
      params: {
        email: session.user.email,
      },
    })

    if (!currentUser) {
      return null
    }

    return currentUser
  } catch (error: any) {
    return null
  }
}
