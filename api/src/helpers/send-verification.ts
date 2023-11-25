import { Resend } from 'resend'
import env from 'dotenv'

// .envの読み込み
env.config()

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationMail(email: string, token: string) {
  const maitContent = `
<p>以下のリンクをクリックして、アカウントを有効にしてください。</p>
<a href="http://localhost:3000/activate?token=${token}">アカウントを有効にする</a>`

  try {
    const data = await resend.emails.send({
      from: 'Info <info@laugh-tech.jp>',
      to: email,
      subject: 'アカウント有効化',
      html: maitContent,
    })
  } catch (error) {
    console.log(error)
  }
}
