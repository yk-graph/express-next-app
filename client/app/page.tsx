import { getServerSession } from 'next-auth'

import { authOptions } from '@/api/auth/[...nextauth]/route'
import { User } from '@/components/user'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Get In ServerSide by getServerSession</h2>
        <pre>{JSON.stringify(session)}</pre>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold">Get In ClientSide by useSession</h2>
        <User />
      </div>
    </div>
  )
}
