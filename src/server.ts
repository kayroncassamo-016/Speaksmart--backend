import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import { cleanupAdminSessions} from './services/admin/cleanupAdminSessions'
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
  
  origin: ["https://speaksmartt.vercel.app","http://localhost:3000"],
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



const PORTA = Number(process.env.PORT) || 5000;

app.listen(PORTA, '0.0.0.0', () => {
  console.log(`SpeakSmart - server online on port ${PORTA}`);

  // Executa uma limpeza ao iniciar o servidor
  cleanupAdminSessions();

  // Repete a limpeza a cada 24 horas
  setInterval(cleanupAdminSessions, 24 * 60 * 60 * 1000);
});