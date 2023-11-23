import axiosInstance from '@/lib/axios'

export async function register(email: string, password: string) {
  try {
    console.log('register', email, password)

    await axiosInstance.post('/auth/register', {
      email,
      password,
    })
  } catch (error) {
    console.log('getUsers Error', error)
  }
}
