import axios from 'axios'
import env from 'dotenv'

// .envの読み込み
env.config()

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_DOMAIN = process.env.SENDGRID_DOMAIN

export async function sendVerificationMail(email: string, token: string) {
  const maitContent = `
    <p>以下のリンクをクリックして、アカウントを有効にしてください。</p>
    <a href="http://localhost:3000/activate/token?=${token}">アカウントを有効にする</a>
  `

  try {
    const res = await axios.post(SENDGRID_DOMAIN, {
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: {
        personalizations: [
          {
            to: [{ email }],
            subject: 'こんにちは！',
          },
        ],
        from: {
          email: 'from_address@example.com',
        },
        content: [
          {
            type: 'text/html',
            value: maitContent,
          },
        ],
      },
    })
  } catch (error) {
    console.log(error)
  }
}
