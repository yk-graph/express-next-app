import { activate } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { ActicateButton } from '@/components/activate-button'

export default async function ActivatePage({ searchParams }: { searchParams: { token: string } }) {
  const { token } = searchParams

  const activatedUser = await activate(token)

  return activatedUser ? (
    <div className="text-center">
      <p className="text-xl font-semibold mb-4">認証完了です!</p>
      <ActicateButton user={activatedUser} />
    </div>
  ) : (
    <div className="text-center">
      <p className="text-xl font-semibold mb-4">ユーザーの登録に失敗しました</p>
      <Button>再度メールを送る</Button>
    </div>
  )
}
