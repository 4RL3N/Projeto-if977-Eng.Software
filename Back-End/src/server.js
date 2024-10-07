import express from 'express'
import dotenv from 'dotenv/config'
import mongoose from 'mongoose'
import authRoutes from './routes/AuthRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postagemRoutes from './routes/postagemRoutes.js'
import cors from 'cors'

const app = express()
app.use(express.json())



app.use(cors({
  origin: 'http://127.0.0.1:5500' 
}))

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', postagemRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch((error) => console.error('Erro ao conectar no MongoDB:', error))

export default app