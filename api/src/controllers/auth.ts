import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { compare, hash } from 'bcrypt'
import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'

import { sendVerificationMail } from '../helpers/send-verification'

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
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    // emailの重複チェック
    if (user) {
      return res.status(400).json({ msg: 'そのメールアドレスは既に登録されています' })
    }

    // ActivateTokenテーブルのtokenを作成（uuidを2つ結合した後にreplaceでハイフンを削除した値を作成）
    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '')

    // パスワードをハッシュ化
    const hashedPassword = await hash(password, 12)

    // ユーザーの作成
    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // ActivateTokenの作成
    const createdActivateToken = await prisma.activateToken.create({
      data: {
        token,
        userId: createdUser.id,
      },
    })

    // ユーザーとActivateTokenの作成が完了したらメールを送信する
    // if (createdUser && createdActivateToken) {
    //   // メール送信
    //   await sendVerificationMail(email, token)
    // }

    return res.status(200).end()
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

// アクティベート POST /api/auth/acitivate
export async function activate(req: Request, res: Response) {
  try {
    const errors = validationResult(req) // バリデーションでエラーになった場合は戻り値に値が入る

    // isEmpty()は値が入っていないかどうかを判定するexpress-validatorの関数
    if (!errors.isEmpty()) {
      const errs = errors.array()
      return res.status(400).json(errs)
    }

    const { token } = req.body

    // ユーザーの取得
    const user = await prisma.user.findFirst({
      where: {
        ActivateToken: {
          some: {
            AND: [{ activatedAt: null }, { createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, { token }],
          },
        },
      },
    })

    // ユーザーが存在しない場合
    if (!user) {
      return res.status(400).json({ msg: 'tokenの値が確認できませんでした' })
    }

    // ユーザー情報の更新
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isActivated: true,
      },
    })

    // ActivateTokenの更新
    await prisma.activateToken.update({
      where: {
        token,
      },
      data: {
        activatedAt: new Date(),
      },
    })

    return res.status(200).json({ msg: 'アクティベートが完了しました' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: '不正なエラーが発生しました' })
  }
}
