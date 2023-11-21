import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { compare, hash } from 'bcrypt'
import { Prisma, PrismaClient } from '@prisma/client'

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient()

// 新規登録 POST /api/auth/register
export async function register(req: Request, res: Response) {
  try {
    const errors = validationResult(req) // バリデーションでエラーになった場合は戻り値に値が入る

    // isEmpty()は値が入っていないかどうかを判定するexpress-validatorの関数
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

    // ユーザーの作成
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: '不正なエラーが発生しました' })
  }
}

// ログイン POST /api/auth/login
export async function login(req: Request, res: Response) {
  try {
    const errors = validationResult(req) // バリデーションでエラーになった場合は戻り値に値が入る

    // isEmpty()は値が入っていないかどうかを判定するexpress-validatorの関数
    if (!errors.isEmpty()) {
      const errs = errors.array()
      return res.status(400).json(errs)
    }

    const { email, password } = req.body

    // ユーザーの取得
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    // ユーザーが存在しない場合
    if (!user) {
      return res.status(400).json({ msg: 'メールアドレスもしくはパスワードが間違っています' })
    }

    // パスワードの照合
    const validPassword = await compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ msg: 'メールアドレスもしくはパスワードが間違っています' })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: '不正なエラーが発生しました' })
  }
}
