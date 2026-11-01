import express from 'express'
import type { Request, Response, NextFunction } from 'express'

import { router } from '../routes'
import cors from "cors"

import cookieParser from 'cookie-parser'

import 'dotenv/config'

const app = express()


app.use(express.json())
// Permite que o Express trabalhe com JSON.
// O JSON recebido no body da requisição é convertido
// em um objeto JavaScript e disponibilizado em req.body.
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(cookieParser())

app.use(router)

app.use((err: Error,req: Request,res: Response,next: NextFunction) => {
    
    if (err instanceof Error) {
      
        return res.status(400).json({
        error: err.message
      })
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error.'
    })
  }
)

app.listen(5000, () => {
  console.log('SpeakSmart - server online !!!!')
})