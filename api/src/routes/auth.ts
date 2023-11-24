import express from 'express'

import { activateValidator, loginValidator, registerValidator } from '../helpers/validator'
import { activate, login, register } from '../controllers/auth'

const router = express.Router()

// 新規登録 POST /api/auth/register
router.post('/register', registerValidator, register)

// ログイン POST /api/auth/login
router.post('/login', loginValidator, login)

// アクティベート POST /api/auth/acitivate
router.post('/activate', activateValidator, activate)

export default router
