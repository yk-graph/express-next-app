import Link from 'next/link'

import { activate } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export default async function ActivatePage({ searchParams }: { searchParams: { token: string } }) {
  const { token } = searchParams

  const isactivate = await activate(token)

  return isactivate ? (
    <div className="text-center">
      <p className="text-xl font-semibold mb-4">認証完了です!</p>
      <Link href="/">トップページへ</Link>
    </div>
  ) : (
    <div className="text-center">
      <p className="text-xl font-semibold mb-4">ユーザーの登録に失敗しました</p>
      <Button>再度メールを送る</Button>
    </div>
  )
}
