import axios from 'axios'
import env from 'dotenv'

// .envの読み込み
env.config()

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_DOMAIN = process.env.SENDGRID_DOMAIN

export async function sendResetPasswordMail(email: string, token: string) {
  const maitContent = `
    <p>以下のリンクをクリックして、パスワードを再設定してください。</p>
    <a href="http://localhost:3000/password-reset?token=${token}&email=${email}">パスワードを再設定する</a>
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
            subject: 'パスワード再設定',
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
