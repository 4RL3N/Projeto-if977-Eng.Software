import jwt from 'jsonwebtoken'
import Usuario from '../src/models/User.js'
import { authenticateAdmin } from '../src/middlewares/adminAuthMiddleware.js'
import { authenticateUser } from '../src/middlewares/authMiddleware.js'
import { handleUploadError } from '../src/middlewares/handleUploadErrorMiddleware.js'
import multer from 'multer'

jest.mock('jsonwebtoken')
jest.mock('../src/models/User.js')


describe('Middlewares', () => {
    describe('authenticateAdmin', () => {
        let req, res, next
    
        beforeEach(() => {
            req = { headers: {} }
            res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
            }
            next = jest.fn()
        })
    
        it('deve retornar erro 401 se o token não for fornecido', async () => {
            await authenticateAdmin(req, res, next)
    
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' })
        })
    
        it('deve retornar erro 403 se o token for inválido', async () => {
            req.headers['authorization'] = 'Bearer invalidToken'
            jwt.verify.mockImplementation(() => { throw new Error('Invalid token') })
    
            await authenticateAdmin(req, res, next)
    
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido', details: new Error('Invalid token') })
        })
    
        it('deve retornar erro 403 se o usuário não for admin', async () => {
            req.headers['authorization'] = 'Bearer validToken'
            jwt.verify.mockReturnValue({ id: '123' })
            Usuario.findById.mockResolvedValue({ _id: '123', categoria: 'User' })
    
            await authenticateAdmin(req, res, next)
    
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado. Somente admins podem visualizar esta rota.' })
        })
    
        it('deve chamar o next se o usuário for admin', async () => {
            req.headers['authorization'] = 'Bearer validToken'
            jwt.verify.mockReturnValue({ id: '123' })
            Usuario.findById.mockResolvedValue({ _id: '123', categoria: 'Admin' })
    
            await authenticateAdmin(req, res, next)
    
            expect(next).toHaveBeenCalled()
        })
        })

    describe('authenticateUser', () => {
        let req, res, next
    
        beforeEach(() => {
            req = { headers: {} }
            res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
            }
            next = jest.fn()
        })
    
        it('deve retornar erro 401 se o token não for fornecido', async () => {
            await authenticateUser(req, res, next)
    
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({ message: 'Acesso negado' })
        })
    
        it('deve retornar erro 403 se o token for inválido', async () => {
            req.headers['authorization'] = 'Bearer invalidToken'
            jwt.verify.mockImplementation(() => { throw new Error('Invalid token') })
    
            await authenticateUser(req, res, next)
    
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' })
        })
    
        it('deve chamar o next se o token for válido', async () => {
            req.headers['authorization'] = 'Bearer validToken'
            jwt.verify.mockReturnValue({ id: '123' })
    
            await authenticateUser(req, res, next)
    
            expect(req.userId).toBe('123')
            expect(next).toHaveBeenCalled()
        })
        })    

    describe('handleUploadError', () => {
        let req, res, next
    
        beforeEach(() => {
            req = {}
            res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
            }
            next = jest.fn()
        })
    
        it('deve retornar erro 400 se for um erro do Multer', () => {
            const err = new multer.MulterError('LIMIT_FILE_SIZE')
    
            handleUploadError(err, req, res, next)
    
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
            error: 'Erro no upload: Tamanho do arquivo excedido ou outro erro relacionado.'
            })
        })
    
        it('deve retornar erro 400 para tipo de arquivo inválido', () => {
            const err = { code: 'INVALID_FILE_TYPE', message: 'Tipo de arquivo inválido' }
    
            handleUploadError(err, req, res, next)
    
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ error: 'Tipo de arquivo inválido' })
        })
    
        it('deve retornar erro 500 para erros gerais de upload', () => {
            const err = new Error('Erro geral no upload')
    
            handleUploadError(err, req, res, next)
    
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
            error: 'Erro interno ao processar o upload. Tente novamente mais tarde.',
            details: err
            })
        })
    
        it('deve chamar o next se não houver erro', () => {
            handleUploadError(null, req, res, next)
    
            expect(next).toHaveBeenCalled()
        })
        })
    
})
    
