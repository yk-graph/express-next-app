import express from 'express'

import { getMe } from '../controllers/me'

const router = express.Router()

// 自分自身の情報を取得 GET /api/me
router.get('/', getMe)

export default router
