import express from 'express'

import authRouter from './auth'
import usersRouter from './users'
import meRouter from './me'

const router = express.Router()
router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/me', meRouter)

export default router
