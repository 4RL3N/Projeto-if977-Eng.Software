import express from 'express'
import dotenv from 'dotenv/config'
import mongoose from 'mongoose'

const app = express()

const port = process.env.PORT || 3000

app.listen(port, ()=> {
    console.log(`Servidor rodando na porta ${port}`)
}
)

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));
