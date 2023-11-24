import { body } from 'express-validator'

export const registerValidator = [
  body('name').notEmpty().withMessage('名前を入力してください'),
  body('email').notEmpty().withMessage('メールアドレスを入力してください'),
  body('email').isEmail().withMessage('メールアドレスの形式が不正です'),
  body('password').notEmpty().withMessage('パスワードを入力してください'),
  body('password').isLength({ min: 4 }).withMessage('パスワードは4文字以上で入力してください'),
]

export const loginValidator = [
  body('email').notEmpty().withMessage('メールアドレスを入力してください'),
  body('email').isEmail().withMessage('メールアドレスの形式が不正です'),
  body('password').notEmpty().withMessage('パスワードを入力してください'),
  body('password').isLength({ min: 4 }).withMessage('パスワードは4文字以上で入力してください'),
]

export const activateValidator = [body('token').notEmpty().withMessage('tokenがありません')]

export const forgotPasswordValidator = [
  body('email').notEmpty().withMessage('メールアドレスを入力してください'),
  body('email').isEmail().withMessage('メールアドレスの形式が不正です'),
]

export const passwordResetValidator = [
  body('token').notEmpty().withMessage('tokenがありません'),
  body('password').notEmpty().withMessage('パスワードを入力してください'),
  body('password').isLength({ min: 4 }).withMessage('パスワードは4文字以上で入力してください'),
]
