import { SessionProvider } from '@/providers/session-provider'
import { Header } from '@/components/header'

// サーバーサイド側の処理でセッション情報から現在ログインしているユーザーがいるかどうかの判定をactions配下の処理で管理している
import getCurrentUser from '@/actions/getCurrentUser'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser()

  return (
    <SessionProvider>
      <Header currentUser={currentUser} />
      {children}
    </SessionProvider>
  )
}
