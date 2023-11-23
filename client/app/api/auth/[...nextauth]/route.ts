import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // サインインフォームに表示する名前を指定できる
      name: 'Login',
      // credentialsオブジェクトにキーを追加することで送信するフィールドを指定できる
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'test@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },

      // authorizeメソッドでサインインフォームから送信されたデータを受け取ることができる
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const { data: user } = await axiosInstance.post('/auth/login', {
          email: credentials.email,
          password: credentials.password,
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],

  // セッションの設定 - JWTを使用したセッションを有効にする
  session: {
    strategy: 'jwt',
  },

  // [FYI] https://qiita.com/kage1020/items/195fdd8749f2439849c1#callbacks
  callbacks: {
    // jwtが呼ばれた後に実行される
    async session({ session, token }) {
      console.log('session session ->', session)
      console.log('session token ->', token)

      // ここでreturnされる値はuseSessionやgetSessionの戻り値になる
      return { ...session, user: { ...session.user, id: token.id } }
    },

    // JWTを使用している場合，useSessionやgetSessionが呼ばれるときjwt関数が実行される
    async jwt({ token, user }) {
      console.log('jwt token ->', token)
      console.log('jwt user ->', user)
      // 初回のログイン成功時にのみuserの中に値が入っている（2回目以降はundefinedになる）
      if (user) {
        return {
          ...token,
          id: user.id,
        }
      }

      // ここでreturnされる値は上記のsession関数のtokenに渡される
      return token
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
