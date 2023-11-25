import { Resend } from 'resend'
import env from 'dotenv'

// .envの読み込み
env.config()

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendResetPasswordMail(email: string, token: string) {
  const maitContent = `
<p>以下のリンクをクリックして、パスワードを再設定してください。</p>
<a href="http://localhost:3000/password-reset?token=${token}&email=${email}">パスワードを再設定する</a>`

  try {
    const data = await resend.emails.send({
      from: 'Info <info@laugh-tech.jp>',
      to: email,
      subject: 'パスワード再設定',
      html: maitContent,
    })
  } catch (error) {
    console.log(error)
  }
}
