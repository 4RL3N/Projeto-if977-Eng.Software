import express from 'express'
import dotenv from 'dotenv/config'
import mongoose from 'mongoose'
import authRoutes from './routes/AuthRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postagemRoutes from './routes/postagemRoutes.js'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'

const app = express()
app.use(express.json())



const allowedOrigins = ['http://127.0.0.1:4000', 'http://127.0.0.1:5500', "http://localhost:4000"]
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'view/public')))
app.use(express.static(path.join(__dirname, 'view/private')))


app.get('/primeiroacesso', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/public/primeiroacesso/primeiroacesso.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/public/login/login.html'))
})

app.get('/definir-senha', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/public/definir-senha/definir-senha-inicial.html'))
})

app.get('/filtros', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/private/filtros/filtros-anuncio.html'))
})

app.get('/editar-usuario', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/private/editar-usuario/editar-usuario.html'))
})

app.get('/meus-anuncios', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/private/meus-anuncios/meus-anuncios.html'))
})

app.get('/autorizacao', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/private/autorizacao/aprovacoes.html'))
})

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