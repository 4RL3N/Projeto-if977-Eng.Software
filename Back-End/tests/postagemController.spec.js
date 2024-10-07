import express from 'express'
import request from 'supertest'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'






import Postagem from '../src/models/Postagem.js'


import {
  listarPostagensDoUsuario,
  listarTodasPostagens,
  listarPostagensComFiltros,
  criarPostagem,
  editarPostagem,
  deletarPostagem,
  aprovarPostagem,
  desaprovarPostagem,
  obterPostagemPorId,
  adicionarImagem
} from '../src/controllers/postagemController.js'


import { authenticateUser } from '../src/middlewares/authMiddleware.js'
import { authenticateAdmin } from '../src/middlewares/adminAuthMiddleware.js'




dotenv.config()





const app = express()
app.use(express.json())
app.get('/postagens',authenticateUser, listarTodasPostagens)
app.get('/postagens-usuario',authenticateUser, listarPostagensDoUsuario)
app.get('/postagens-filtros',authenticateUser, listarPostagensComFiltros)
app.post('/criar-postagem', criarPostagem)
app.patch('/editar-postagem/:id', authenticateUser, editarPostagem)
app.delete('/postagem/:id',authenticateUser, deletarPostagem)
app.patch('/aprovar-post/:id', authenticateAdmin, aprovarPostagem)
app.patch('/desaprovar-post/:id', authenticateAdmin, desaprovarPostagem)
app.get('/postagem/:id', authenticateUser, obterPostagemPorId)





mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch((error) => console.error('Erro ao conectar no MongoDB:', error))


jest.mock('../src/models/Postagem.js')



const generateToken = (id, categoria) => {
  return jwt.sign({ id, categoria }, process.env.JWT_SECRET, { expiresIn: '1h' })
}




describe('POSTAGENS Controller', () => {
  afterEach(() => {
    jest.clearAllMocks() 
  })

  describe('Controller: listarTodasPostagens', () => {
    test('deve listar todas as postagens com sucesso', async () => {
      const mockPostagens = [
        { titulo: 'Postagem 1', cliente: { nome: 'Cliente 1', contato: '12345' } },
        { titulo: 'Postagem 2', cliente: { nome: 'Cliente 2', contato: '67890' } },
      ]

      
      Postagem.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPostagens),
      })

      const token = generateToken('mockUserId', 'User') 

      const response = await request(app)
        .get('/postagens')
        .set('Authorization', `Bearer ${token}`) 
      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockPostagens)
    })

    test('deve retornar 404 se nenhuma postagem for encontrada', async () => {
      Postagem.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      })

      const token = generateToken('mockUserId', 'User') 
      const response = await request(app)
        .get('/postagens')
        .set('Authorization', `Bearer ${token}`) 

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Nenhuma postagem encontrada.' })
    })

    test('deve retornar 500 em caso de erro no servidor', async () => {
      Postagem.find.mockImplementation(() => {
        throw new Error('Erro de banco de dados')
      })

      const token = generateToken('mockUserId', 'User') 

      const response = await request(app)
        .get('/postagens')
        .set('Authorization', `Bearer ${token}`) 

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Erro interno no servidor.' })
    })
  })

  describe('Controller: listarPostagensDoUsuario', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    const mockUserId = '123'
    
    const generateToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    }

    it('deve retornar 200 e uma lista de postagens do usuário', async () => {
      
      const token = generateToken(mockUserId)
      
      
      const req = {
        headers: { authorization: `Bearer ${token}` },
        userId: mockUserId,
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      
      const postagensMock = [
        { _id: new mongoose.Types.ObjectId(), cliente: { nome: 'Cliente 1', contato: '1234' } },
        { _id: new mongoose.Types.ObjectId(), cliente: { nome: 'Cliente 2', contato: '5678' } },
      ]

      
      Postagem.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(postagensMock),
      })

      await listarPostagensDoUsuario(req, res)

      expect(Postagem.find).toHaveBeenCalledWith({ cliente: req.userId })
      expect(Postagem.find().populate).toHaveBeenCalledWith('cliente', 'nome contato')
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(postagensMock)
    })

    it('deve retornar 404 quando nenhuma postagem for encontrada', async () => {
      
      const token = generateToken(mockUserId)
      
      const req = {
        headers: { authorization: `Bearer ${token}` },
        userId: mockUserId,
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      
      Postagem.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      })

      await listarPostagensDoUsuario(req, res)

      expect(Postagem.find).toHaveBeenCalledWith({ cliente: req.userId })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Nenhuma postagem encontrada.' })
    })

    it('deve retornar 500 em caso de erro no servidor', async () => {
      
      const token = generateToken(mockUserId)
      
      const req = {
        headers: { authorization: `Bearer ${token}` },
        userId: mockUserId,
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

    
      Postagem.find.mockImplementation(() => {
        throw new Error('Erro de banco de dados')
      })

      await listarPostagensDoUsuario(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno no servidor.' })
    })
  })

  describe('Controller: listarPostagensComFiltros', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    const mockUserId = '123'

    
    const generateToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    }

    it('deve listar postagens com filtros aplicados', async () => {
      const mockPostagens = [
        { titulo: 'Postagem 1', cliente: { nome: 'Cliente 1', contato: '1234' } },
        { titulo: 'Postagem 2', cliente: { nome: 'Cliente 2', contato: '5678' } },
      ]

      
      const mockFind = jest.spyOn(Postagem, 'find').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPostagens),
      })

      
      const token = generateToken(mockUserId)

      
      const req = {
        query: {
          cidade: 'São Paulo',
          bairro: 'Centro',
        },
        headers: { authorization: `Bearer ${token}` },
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await listarPostagensComFiltros(req, res)

      expect(mockFind).toHaveBeenCalledWith({
        autorizada: true,
        cidade: 'São Paulo',
        bairro: 'Centro',
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockPostagens)

      mockFind.mockRestore()
    })

    it('deve retornar 404 se nenhuma postagem for encontrada', async () => {
      
      Postagem.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      })

      
      const token = generateToken(mockUserId)

      
      const req = {
        query: {
          cidade: 'São Paulo',
          bairro: 'Centro',
        },
        headers: { authorization: `Bearer ${token}` },
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await listarPostagensComFiltros(req, res)

      expect(Postagem.find).toHaveBeenCalledWith({
        autorizada: true,
        cidade: 'São Paulo',
        bairro: 'Centro',
      })

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Nenhuma postagem encontrada.' })
    })

    it('deve retornar 500 em caso de erro no servidor', async () => {
      
      Postagem.find.mockImplementation(() => {
        throw new Error('Erro de banco de dados')
      })

      
      const token = generateToken(mockUserId)

      const req = {
        query: {
          cidade: 'São Paulo',
          bairro: 'Centro',
        },
        headers: { authorization: `Bearer ${token}` },
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await listarPostagensComFiltros(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno no servidor.' })
    })
  })

  describe('Controller: criarPostagem', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    const mockUserId = '123'

  
    const generateToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    }

    it('deve criar uma nova postagem com sucesso', async () => {
      const mockPostagem = {
        _id: new mongoose.Types.ObjectId().toString(),  
        titulo: 'Postagem Teste',
        desc: 'Descrição da postagem',
        categoria: 'Categoria Teste',
        valor: 100,
        contato: 'Contato Teste',
        cidade: 'Cidade Teste',
        bairro: 'Bairro Teste',
        acomodacao: 'Casa',
        tipo_acomodacao: 'Individual',
        fotos: [],
        cliente: mockUserId,  
      }

      
      Postagem.prototype.save.mockResolvedValue(mockPostagem)

      
      const token = generateToken(mockUserId)

      const response = await request(app)
        .post('/criar-postagem')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Postagem Teste',
          desc: 'Descrição da postagem',
          categoria: 'Categoria Teste',
          valor: 100,
          contato: 'Contato Teste',
          cidade: 'Cidade Teste',
          bairro: 'Bairro Teste',
          acomodacao: 'Casa',
          tipo_acomodacao: 'Individual',
        })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(mockPostagem)
      expect(Postagem.prototype.save).toHaveBeenCalled()
    })

    it('deve retornar 400 se faltar algum campo obrigatório', async () => {
      const token = generateToken(mockUserId)

      const response = await request(app)
        .post('/criar-postagem')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Postagem Teste',
          desc: 'Descrição da postagem',
          categoria: 'Categoria Teste',
          valor: 100,
          contato: 'Contato Teste',
          cidade: 'Cidade Teste',
          tipo_acomodacao: 'Individual',
        })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Todos os campos obrigatórios devem ser preenchidos' })
    })

    it('deve retornar 500 em caso de erro no servidor', async () => {
      const erroSimulado = new Error('Erro ao salvar a postagem')

      Postagem.prototype.save.mockImplementation(() => {
        throw erroSimulado
      })

      const token = generateToken(mockUserId)

      const response = await request(app)
        .post('/criar-postagem')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Postagem Teste',
          desc: 'Descrição da postagem',
          categoria: 'Categoria Teste',
          valor: 100,
          contato: 'Contato Teste',
          cidade: 'Cidade Teste',
          bairro: 'Bairro Teste',
          acomodacao: 'Casa',
          tipo_acomodacao: 'Individual',
        })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        error: 'Erro ao criar postagem',
        detalhe: 'Erro ao salvar a postagem', 
      })
    })
  })

  

  describe('Controller: deletarPostagem', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('deve deletar a postagem com sucesso', async () => {
      const mockPostagem = {
        _id: '66f8bceca0e092cad75f6d9d',
        cliente: '66f7258e800fe3f8c5aca85f',
        deleteOne: jest.fn(),
      }
      const deletePostagem = {
        _id: '66f8bceca0e092cad75f6d9d',
        cliente: '66f7258e800fe3f8c5aca85f',
        cliente: "userId"
      }

      Postagem.findById.mockResolvedValue(mockPostagem)

      const token = jwt.sign({ id: 'userId', clienteId: mockPostagem.cliente }, process.env.JWT_SECRET)

      const response = await request(app).delete(`/postagem/${mockPostagem._id}`).set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Postagem deletada com sucesso' })
      expect(Postagem.findById).toHaveBeenCalledWith(deletePostagem)
      expect(mockPostagem.deleteOne).toHaveBeenCalled()
    })

    it('deve retornar 404 se a postagem não for encontrada ou se o usuário não tiver permissão', async () => {
      Postagem.findById.mockResolvedValue(null)

      const token = jwt.sign({ id: 'userId' }, process.env.JWT_SECRET)

      const response = await request(app).delete(`/postagem/invalid-id`).set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Postagem não encontrada ou você não tem permissão para deletar' })
    })

    it('deve retornar 500 em caso de erro no servidor', async () => {
      Postagem.findById.mockImplementation(() => {
        throw new Error('Erro no servidor')
      })

      const token = jwt.sign({ id: 'userId' }, process.env.JWT_SECRET)

      const response = await request(app).delete(`/postagem/id-invalido`).set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Erro ao deletar a postagem' })
    })
  })

  describe('Controller: aprovarPostagem', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })
  
    const gerarTokenAdmin = () => {
      const payload = { id: '66f4ca8991cd3c01e1c69ada', categoria: 'Admin' }
      return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })
    }
  
    it('deve aprovar a postagem com sucesso', async () => {
      const mockPostagem = { _id: '66f8bceca0e092cad75f6d9d', autorizada: false, save: jest.fn() }
      const updatedPostagem = { _id: '66f8bceca0e092cad75f6d9d', autorizada: true }
  
      Postagem.findById.mockResolvedValue(mockPostagem)
  
      const token = gerarTokenAdmin()
  
      const response = await request(app).patch(`/aprovar-post/${mockPostagem._id}`).set('Authorization', `Bearer ${token}`)
  
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Postagem aprovada com sucesso', postagem: updatedPostagem })
      expect(mockPostagem.autorizada).toBe(true)
      expect(mockPostagem.save).toHaveBeenCalled()
    }, 10000)
  
    it('deve retornar 404 se a postagem não for encontrada', async () => {
      Postagem.findById.mockResolvedValue(null)
  
      const token = gerarTokenAdmin()
  
      const response = await request(app)
        .patch('/aprovar-post/66f8bceca0e092cad75f6d9d')
        .set('Authorization', `Bearer ${token}`)
  
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Postagem não encontrada' })
    })
  
    it('deve retornar 500 em caso de erro no servidor', async () => {
      Postagem.findById.mockImplementation(() => {
        throw new Error('Erro no servidor')
      })
  
      const token = gerarTokenAdmin()
  
      const response = await request(app)
        .patch('/aprovar-post/66f8bceca0e092cad75f6d9d')
        .set('Authorization', `Bearer ${token}`)
  
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Erro ao aprovar a postagem' })
    })
  })
    
  describe('Teste Unitário: desaprovarPostagem', () => {
    const gerarTokenAdmin = () => {
      const payload = { id: '66f4ca8991cd3c01e1c69ada', categoria: 'Admin' }
      return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })
    }
    it('deve desaprovar a postagem com sucesso', async () => {
      const req = {
        params: { id: 'somePostagemId' },
        body: { motivo: 'Motivo da desaprovação' },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      const mockPostagem = {
        _id: 'somePostagemId',
        autorizada: true,
        save: jest.fn().mockResolvedValue(true),
      }

      Postagem.findById.mockResolvedValue(mockPostagem)

      await desaprovarPostagem(req, res)

      expect(Postagem.findById).toHaveBeenCalledWith('somePostagemId')
      expect(mockPostagem.autorizada).toBe(false)
      expect(mockPostagem.motivo).toBe('Motivo da desaprovação')
      expect(mockPostagem.save).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Postagem desaprovada com sucesso',
        postagem: mockPostagem,
      })
    })

    it('deve retornar 400 se o motivo não for fornecido', async () => {
      const req = {
        params: { id: 'somePostagemId' },
        body: {},
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await desaprovarPostagem(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Motivo é obrigatório ao desaprovar a postagem',
      })
    })

    it('deve retornar 404 se a postagem não for encontrada', async () => {
      const req = {
        params: { id: 'someNonExistentId' },
        body: { motivo: 'Motivo da desaprovação' },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      Postagem.findById.mockResolvedValue(null)

      await desaprovarPostagem(req, res)

      expect(Postagem.findById).toHaveBeenCalledWith('someNonExistentId')
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Postagem não encontrada' })
    })

    it('deve retornar 500 em caso de erro no servidor', async () => {
      const req = {
        params: { id: 'somePostagemId' },
        body: { motivo: 'Motivo da desaprovação' },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      Postagem.findById.mockImplementation(() => {
        throw new Error('Erro no servidor')
      })

      await desaprovarPostagem(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao desaprovar a postagem' })
    })
  })

  describe('Teste de Integração: desaprovarPostagem', () => {
    const gerarTokenAdmin = () => {
      const payload = { id: '66f4ca8991cd3c01e1c69ada', categoria: 'Admin' }
      return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })
    }
    it('deve desaprovar a postagem com sucesso', async () => {
      const mockPostagem = {
        _id: 'somePostagemId',
        autorizada: true,
        save: jest.fn().mockResolvedValue(true),
      }
      const updatedPostagem = {
        _id: 'somePostagemId',
        autorizada: false,
        motivo: 'Motivo da desaprovação',
      }

      Postagem.findById.mockResolvedValue(mockPostagem)

      const token = gerarTokenAdmin()

      const response = await request(app)
        .patch(`/desaprovar-post/${mockPostagem._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ motivo: 'Motivo da desaprovação' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Postagem desaprovada com sucesso',
        postagem: expect.objectContaining(updatedPostagem),
      })
      expect(mockPostagem.autorizada).toBe(false)
      expect(mockPostagem.motivo).toBe('Motivo da desaprovação')
      expect(mockPostagem.save).toHaveBeenCalled()
    })

    it('deve retornar 400 se o motivo não for fornecido', async () => {
      const token = gerarTokenAdmin()

      const response = await request(app)
        .patch(`/desaprovar-post/somePostagemId`)
        .set('Authorization', `Bearer ${token}`)
        .send({})

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Motivo é obrigatório ao desaprovar a postagem' })
    })

    it('deve retornar 404 se a postagem não for encontrada', async () => {
      Postagem.findById.mockResolvedValue(null)

      const token = gerarTokenAdmin()

      const response = await request(app)
        .patch(`/desaprovar-post/someNonExistentId`)
        .set('Authorization', `Bearer ${token}`)
        .send({ motivo: 'Motivo da desaprovação' })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Postagem não encontrada' })
    })

    it('deve retornar 500 em caso de erro no servidor', async () => {
      Postagem.findById.mockImplementation(() => {
        throw new Error('Erro no servidor')
      })

      const token = gerarTokenAdmin()

      const response = await request(app)
        .patch(`/desaprovar-post/somePostagemId`)
        .set('Authorization', `Bearer ${token}`)
        .send({ motivo: 'Motivo da desaprovação' })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Erro ao desaprovar a postagem' })
    })
  })

  describe('Bloco: obterPostagemPorId', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })
    const gerarTokenUsuario = () => {
      const payload = { id: 'mockUserId', categoria: 'User' }
      return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })
    }
  
    describe('Teste Unitário: obterPostagemPorId', () => {
      it('deve retornar 200 e a postagem quando encontrada', async () => {
        const req = {
          params: { id: '66f8bceca0e092cad75f6d9d' },
        }
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
  
        const mockPostagem = {
          _id: '66f8bceca0e092cad75f6d9d',
          titulo: 'Postagem Teste',
          cliente: { nome: 'Cliente Teste' },
        }
  
        Postagem.findById.mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockPostagem),
        })
  
        await obterPostagemPorId(req, res)
  
        expect(Postagem.findById).toHaveBeenCalledWith('66f8bceca0e092cad75f6d9d')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockPostagem)
      })
  
      it('deve retornar 404 se a postagem não for encontrada', async () => {
        const req = {
          params: { id: '66f8bceca0e092cad75f6d9d' },
        }
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
  
        Postagem.findById.mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        })
  
        await obterPostagemPorId(req, res)
  
        expect(Postagem.findById).toHaveBeenCalledWith('66f8bceca0e092cad75f6d9d')
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: 'Postagem não encontrada' })
      })
  
      it('deve retornar 500 em caso de erro no servidor', async () => {
        const req = {
          params: { id: '66f8bceca0e092cad75f6d9d' },
        }
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
  
        Postagem.findById.mockImplementation(() => {
          throw new Error('Erro no servidor')
        })
  
        await obterPostagemPorId(req, res)
  
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao obter a postagem' })
      })
    })
  
    describe('Teste de Integração: obterPostagemPorId', () => {
      it('deve retornar 200 e a postagem quando encontrada', async () => {
        const mockPostagem = {
          _id: '66f8bceca0e092cad75f6d9d',
          titulo: 'Postagem Teste',
          cliente: { nome: 'Cliente Teste' },
        }
  
        Postagem.findById.mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockPostagem),
        })
  
        const token = gerarTokenUsuario()
  
        const res = await request(app)
          .get('/postagem/66f8bceca0e092cad75f6d9d')
          .set('Authorization', `Bearer ${token}`)
  
        expect(res.status).toBe(200)
        expect(res.body).toEqual(mockPostagem)
      })
  
      it('deve retornar 404 se a postagem não for encontrada', async () => {
        Postagem.findById.mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        })
  
        const token = gerarTokenUsuario()
  
        const res = await request(app)
          .get('/postagem/66f8bceca0e092cad75f6d9d')
          .set('Authorization', `Bearer ${token}`)
  
        expect(res.status).toBe(404)
        expect(res.body).toEqual({ error: 'Postagem não encontrada' })
      })
  
      it('deve retornar 500 em caso de erro no servidor', async () => {
        Postagem.findById.mockImplementation(() => {
          throw new Error('Erro no servidor')
        })
  
        const token = gerarTokenUsuario()
  
        const res = await request(app)
          .get('/postagem/66f8bceca0e092cad75f6d9d')
          .set('Authorization', `Bearer ${token}`)
  
        expect(res.status).toBe(500)
        expect(res.body).toEqual({ error: 'Erro ao obter a postagem' })
      })
    })
  })
  
  describe('Bloco: adicionarImagem', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const gerarTokenUsuario = () => {
    const payload = { id: 'mockUserId', categoria: 'User' }
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })
  }

  describe('Teste Unitário: adicionarImagem', () => {
    it('deve retornar 404 se a postagem não for encontrada', async () => {
      const req = {
        params: { id: '123' },
        files: []
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      Postagem.findById.mockResolvedValue(null)

      await adicionarImagem(req, res)

      expect(Postagem.findById).toHaveBeenCalledWith('123')
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Postagem não encontrada' })
    })

    it('deve retornar 400 se nenhuma imagem for enviada', async () => {
      const req = {
        params: { id: '123' },
        files: []
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      const mockPostagem = { fotos: [], save: jest.fn() }
      Postagem.findById.mockResolvedValue(mockPostagem)

      await adicionarImagem(req, res)

      expect(Postagem.findById).toHaveBeenCalledWith('123')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Nenhuma imagem enviada' })
    })

    it('deve adicionar imagens e retornar a postagem', async () => {
      const req = {
        params: { id: '123' },
        files: [{ location: 'imagem1.jpg' }, { location: 'imagem2.jpg' }]
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      const mockPostagem = { fotos: [], save: jest.fn() }
      Postagem.findById.mockResolvedValue(mockPostagem)

      await adicionarImagem(req, res)

      expect(mockPostagem.fotos).toContain('imagem1.jpg')
      expect(mockPostagem.fotos).toContain('imagem2.jpg')
      expect(mockPostagem.save).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockPostagem)
    })

    it('deve retornar 500 em caso de erro no servidor', async () => {
      const req = {
        params: { id: '66f8bceca0e092cad75f6d9d' },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
    
      Postagem.findById.mockImplementation(() => {
        throw new Error('Erro no servidor')
      })
    
      await adicionarImagem(req, res)
    
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao adicionar imagem', detalhe: 'Erro no servidor' }) 
    
  })
})
  

})
describe('Controller: esqueceuSenha', () => {
  test('deve enviar email de redefinição de senha com sucesso', async () => {
    const mockUsuario = { _id: 'mockUserId', email: 'usuario@teste.com' }
    
    Usuario.findOne = jest.fn().mockResolvedValue(mockUsuario) // Mocka o usuário encontrado
    jwt.sign = jest.fn().mockReturnValue('mockToken') // Mocka a criação do token
    sendMail = jest.fn().mockResolvedValue() // Mocka o envio do email

    const response = await request(app)
      .post('/esqueceu-senha')
      .send({ email: mockUsuario.email })

    expect(Usuario.findOne).toHaveBeenCalledWith({ email: mockUsuario.email })
    expect(jwt.sign).toHaveBeenCalledWith({ id: mockUsuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    expect(sendMail).toHaveBeenCalledWith(
      mockUsuario.email,
      'Redefinição de senha',
      expect.stringContaining(`${process.env.FRONTEND_URL}/redefinir-senha/mockToken`)
    )
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Email de redefinição de senha enviado com sucesso.' })
  })

  test('deve retornar 404 se o usuário não for encontrado', async () => {
    Usuario.findOne = jest.fn().mockResolvedValue(null) // Mocka a ausência de usuário

    const response = await request(app)
      .post('/esqueceu-senha')
      .send({ email: 'usuario@inexistente.com' })

    expect(Usuario.findOne).toHaveBeenCalledWith({ email: 'usuario@inexistente.com' })
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'Usuário não encontrado.' })
  })

  test('deve retornar 500 em caso de erro no servidor', async () => {
    Usuario.findOne = jest.fn().mockImplementation(() => {
      throw new Error('Erro ao buscar usuário')
    })

    const response = await request(app)
      .post('/esqueceu-senha')
      .send({ email: 'usuario@teste.com' })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Erro interno no servidor.' })
  })
})

describe('Controller: redefinirSenha', () => {
  test('deve redefinir a senha com sucesso', async () => {
    const mockUsuario = { _id: 'mockUserId', senha: 'senhaAntiga' }
    
    jwt.verify = jest.fn().mockReturnValue({ id: mockUsuario._id }) // Mocka a verificação do token
    Usuario.findById = jest.fn().mockResolvedValue(mockUsuario) // Mocka a busca pelo usuário
    bcrypt.genSalt = jest.fn().mockResolvedValue('salt')
    bcrypt.hash = jest.fn().mockResolvedValue('novaSenhaHash')
    mockUsuario.save = jest.fn().mockResolvedValue(mockUsuario) // Mocka o salvamento da nova senha

    const response = await request(app)
      .post('/redefinir-senha/mockToken')
      .send({ senha: 'novaSenha' })

    expect(jwt.verify).toHaveBeenCalledWith('mockToken', process.env.JWT_SECRET)
    expect(Usuario.findById).toHaveBeenCalledWith(mockUsuario._id)
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
    expect(bcrypt.hash).toHaveBeenCalledWith('novaSenha', 'salt')
    expect(mockUsuario.save).toHaveBeenCalled()
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Senha redefinida com sucesso.' })
  })

  test('deve retornar 400 se a senha não for fornecida', async () => {
    const response = await request(app)
      .post('/redefinir-senha/mockToken')
      .send({ senha: '' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Senha é obrigatória' })
  })

  test('deve retornar 404 se o usuário não for encontrado', async () => {
    jwt.verify = jest.fn().mockReturnValue({ id: 'mockUserId' })
    Usuario.findById = jest.fn().mockResolvedValue(null) // Mocka a ausência de usuário

    const response = await request(app)
      .post('/redefinir-senha/mockToken')
      .send({ senha: 'novaSenha' })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Usuário não encontrado' })
  })

  test('deve retornar 500 em caso de erro no servidor', async () => {
    jwt.verify = jest.fn().mockReturnValue({ id: 'mockUserId' })
    Usuario.findById = jest.fn().mockImplementation(() => {
      throw new Error('Erro ao buscar usuário')
    })

    const response = await request(app)
      .post('/redefinir-senha/mockToken')
      .send({ senha: 'novaSenha' })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Erro interno no servidor.' })
  })
})
})