import express from 'express'

import { registerValidator } from '../helpers/validator'
import { register } from '../controllers/auth'

const router = express.Router()

// 新規登録 POST /api/auth/register
router.post('/register', registerValidator, register)

// ログイン /api/auth/login
router.post('/login')

// ログアウト /api/auth/logout

export default router
