import express from 'express'

import { getUsers } from '../controllers/users'

const router = express.Router()

// 一覧取得 GET /api/users
router.get('/', getUsers)

export default router
