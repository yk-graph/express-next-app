import express from 'express'

import { signupValidator } from '../helpers/validator'
import { signup } from '../controllers/auth'

const router = express.Router()

// 新規登録 POST /api/auth/signup
router.post('/signup', signupValidator, signup)

// ログイン /api/auth/login

// ログアウト /api/auth/logout

export default router
