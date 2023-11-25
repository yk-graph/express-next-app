import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient()

export async function getMe(req: Request, res: Response) {
  try {
    const email = req.query.email as string

    const user = await prisma.user.findUnique({
      where: {
        email,
        isActivated: true,
      },
    })

    // ユーザーが存在しない場合
    if (!user) {
      return res.status(400).json({ msg: 'ユーザーが存在しません' })
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  } catch (error) {}
}
