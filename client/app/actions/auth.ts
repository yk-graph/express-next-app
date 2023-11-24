import axiosInstance from '@/lib/axios'

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
    console.log('activate res', res)

    if (res.status === 200) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('activate Error', error)
    return false
  }
}
