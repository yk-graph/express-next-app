import express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import env from 'dotenv'

import apiRoutes from './routes'

// .envの読み込み
env.config()

const app = express()
const port = process.env.PORT || 8080

app.use(cors({ credentials: true }))
app.use(compression()) // 静的リソースを圧縮しexpressのレスポンスを改善するmiddleware
app.use(express.json()) // 返却する値をjsonに設定するmiddleware
app.use(cookieParser()) // cookieを扱うためのmiddleware
app.use('/api', apiRoutes)

// サーバーの起動
app.listen(port, () => {
  console.log(`Server start! http://localhost:${port}`)
})
