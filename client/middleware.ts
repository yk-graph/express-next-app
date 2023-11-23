// セッションがないユーザーはログインページにリダイレクトするためのミドルウェア
export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/users/:id/:path*', // /users/:id 以下の全てのパスは認証が必要
    '/profile', // /profile 以下の全てのパスは認証が必要
  ],
}
