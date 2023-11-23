import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('sato', 12)
  const user = await prisma.user.upsert({
    where: { email: 'sato@gmail.com' },
    update: {},
    create: {
      email: 'sato@gmail.com',
      name: 'sato',
      password,
    },
  })
  console.log({ user })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
