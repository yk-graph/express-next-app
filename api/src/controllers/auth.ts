import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { compare, hash } from 'bcrypt'
import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'

import { sendVerificationMail } from '../helpers/send-verification'
import { sendResetPasswordMail } from 'helpers/send-reset-password'

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
            AND: [
              { activatedAt: null }, // activateがまだ有効になっていない = activatedAtがnullのもの
              { createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // 24時間以内に作成されたもの
              { token }, // tokenが一致するもの
            ],
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

// パスワードリセットtoken発行 POST /api/auth/forgot-password
export async function forgotPassword(req: Request, res: Response) {
  try {
    const errors = validationResult(req) // バリデーションでエラーになった場合は戻り値に値が入る

    // isEmpty()は値が入っていないかどうかを判定するexpress-validatorの関数
    if (!errors.isEmpty()) {
      const errs = errors.array()
      return res.status(400).json(errs)
    }

    const { email } = req.body

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

    // PasswordResetTokenテーブルのtokenを作成（uuidを2つ結合した後にreplaceでハイフンを削除した値を作成）
    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '')

    // PasswordResetTokenの作成
    const createdPasswordResetToken = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
      },
    })

    // PasswordResetTokenの作成が完了したらメールを送信する
    // if (createdPasswordResetToken) {
    //   // メール送信
    //   await sendResetPasswordMail(email, token)
    // }

    return res.status(200).json(createdPasswordResetToken)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: '不正なエラーが発生しました' })
  }
}

// パスワードリセット PATCH /api/auth/password-reset
export async function passwordReset(req: Request, res: Response) {
  try {
    const errors = validationResult(req) // バリデーションでエラーになった場合は戻り値に値が入る

    // isEmpty()は値が入っていないかどうかを判定するexpress-validatorの関数
    if (!errors.isEmpty()) {
      const errs = errors.array()
      return res.status(400).json(errs)
    }

    const { token, email, password } = req.body

    // ユーザーの取得
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    // PasswordResetTokenの取得
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        token, // tokenが一致するもの
        resetedAt: null, // まだ更新が完了していない = resetedAtがnullのもの
        createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 24時間以内に作成されたもの
      },
    })

    // 有効なtokenが存在しない場合は再送信を依頼する
    if (!passwordResetToken) {
      return res.status(400).json({ msg: '有効なtokenの値が確認できませんでした' })
    }

    // パスワードをハッシュ化
    const hashedPassword = await hash(password, 12)

    // ユーザー情報の更新
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    // PasswordResetTokenの更新
    await prisma.passwordResetToken.update({
      where: {
        token,
      },
      data: {
        resetedAt: new Date(),
      },
    })

    return res.status(200).json({ msg: 'パスワードのリセットが完了しました' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: '不正なエラーが発生しました' })
  }
}
