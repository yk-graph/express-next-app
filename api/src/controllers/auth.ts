import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { hash } from 'bcrypt'
import { Prisma, PrismaClient } from '@prisma/client'

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient()

// 新規作成: /api/books
export async function signup(req: Request, res: Response) {
  try {
    const errors = validationResult(req) // バリデーションでエラーになった場合は戻り値に値が入る

    if (!errors.isEmpty()) {
      const errs = errors.array()
      return res.status(400).json(errs)
    }

    const { name, email, password } = req.body

    // emailの重複チェック
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user) {
      return res.status(400).json({ msg: 'そのメールアドレスは既に登録されています' })
    }

    // パスワードをハッシュ化
    const hashedPassword = await hash(password, 10)
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return res.status(201).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: '不正なエラーが発生しました' })
  }
}
