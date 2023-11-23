import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { compare, hash } from 'bcrypt'
import { Prisma, PrismaClient } from '@prisma/client'

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient()

// ユーザー一覧取得 GET /api/users
export async function getUsers(req: Request, res: Response) {
  try {
    const result = await prisma.user.findMany()
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: '不正なエラーが発生しました' })
  }
}
