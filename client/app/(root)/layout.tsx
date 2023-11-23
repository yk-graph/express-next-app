import { SessionProvider } from '@/providers/session-provider'
import { Header } from '@/components/header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      {children}
    </SessionProvider>
  )
}
