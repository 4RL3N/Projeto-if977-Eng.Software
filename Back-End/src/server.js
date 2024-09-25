import express from 'express'
import dotenv from 'dotenv/config'
import mongoose from 'mongoose'
// import authRoutes from './routes/AuthRoutes.js'
// import userRoutes from './routes/userRoutes.js'
// import postgemRoutes from './routes/postagemRoutes.js'

const app = express()
app.use(express.json())


app.use('api/')
app.use('api/')
app.use('api/')

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})


mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Conectado ao MongoDB!"))
  .catch((error) => console.error("Erro ao conectar no MongoDB:", error))
