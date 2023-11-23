import { getUsers } from '@/actions/users'

export default async function usersPage() {
  const users = await getUsers()

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">ユーザー一覧ページ</h2>
      <p>詳細画面を見るためにはログインが必要です</p>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            <a href={`/users/${user.id}`}>{user.name}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
