import axios from 'axios'

export async function getUsers() {
  try {
    const { data } = await axios.get(`${process.env.API_URL}/users`)
    return data
  } catch (error) {
    console.log('getUsers Error', error)
  }
}
