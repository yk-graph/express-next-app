import axiosInstance from '@/lib/axios'

export async function getUsers() {
  try {
    const { data: users } = await axiosInstance.get('/users')
    return users
  } catch (error) {
    console.log('getUsers Error', error)
  }
}
