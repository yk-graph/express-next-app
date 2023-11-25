import express from 'express'

import {
  activateValidator,
  forgotPasswordValidator,
  loginValidator,
  passwordResetValidator,
  registerValidator,
} from '../helpers/validator'
import { activate, forgotPassword, login, passwordReset, register } from '../controllers/auth'

const router = express.Router()

// 新規登録 POST /api/auth/register
router.post('/register', registerValidator, register)

// ログイン POST /api/auth/login
router.post('/login', loginValidator, login)

// アクティベート POST /api/auth/activate
router.post('/activate', activateValidator, activate)

// パスワードリセットtoken発行 POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordValidator, forgotPassword)

// パスワードリセット PATCH /api/auth/password-reset
router.patch('/password-reset', passwordResetValidator, passwordReset)

export default router
