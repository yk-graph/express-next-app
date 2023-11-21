import { body } from 'express-validator'

export const registerValidator = [
  body('name').notEmpty().withMessage('名前を入力してください'),
  body('email').notEmpty().withMessage('メールアドレスを入力してください'),
  body('email').isEmail().withMessage('メールアドレスの形式が不正です'),
  body('password').notEmpty().withMessage('パスワードを入力してください'),
  body('password').isLength({ min: 8 }).withMessage('パスワードは8文字以上で入力してください'),
]
