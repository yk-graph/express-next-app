import axiosInstance from '@/lib/axios'
import jwt from 'jsonwebtoken'

type TokenPayload = {
  email: string
  password: string
}

export async function register(email: string, password: string) {
  try {
    await axiosInstance.post('/auth/register', {
      email,
      password,
    })
  } catch (error) {
    console.log('register Error', error)
  }
}

export async function activate(token: string) {
  try {
    const res = await axiosInstance.post('/auth/activate', {
      token,
    })

    if (res.status === 200) {
      // tokenをdecodeして、payloadに含まれている email と password の値を取得する ★重要!!API側のsecretと同じ値を指定する
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload

      return {
        email: decoded.email,
        password: decoded.password,
      }
    } else {
      return null
    }
  } catch (error) {
    console.log('activate Error', error)
    return null
  }
}
