import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/server.js'
import dotenv from 'dotenv'

dotenv.config()

describe('Server', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    describe('Testes Unitários do Servidor', () => {
        it('deve retornar 200 e mensagem de sucesso para rota de autenticação', async () => {
            const res = await request(app).post('/api/login').send({
                email: 'gustavo@example2.com',
                senha: '12345678'
            })
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('message', 'Login bem-sucedido')
        })

        it('deve retornar 404 para rota inexistente', async () => {
            const res = await request(app).get('/api/rota_inexistente')
            expect(res.status).toBe(404)
        })
    })

    describe('Testes de Integração do Servidor', () => {
        it('deve retornar 200 e mensagem de sucesso para rota de autenticação', async () => {
            const res = await request(app).post('/api/login').send({
                email: 'gustavo@example2.com',
                senha: '12345678'
            })
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('message', 'Login bem-sucedido')
        })

    })
})
