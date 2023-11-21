import express from 'express'

import { loginValidator, registerValidator } from '../helpers/validator'
import { login, register } from '../controllers/auth'

const router = express.Router()

// 新規登録 POST /api/auth/register
router.post('/register', registerValidator, register)

// ログイン POST /api/auth/login
router.post('/login', loginValidator, login)

// ログアウト /api/auth/logout

export default router
