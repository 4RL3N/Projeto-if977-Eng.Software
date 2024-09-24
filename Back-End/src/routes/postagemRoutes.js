import { authenticateUser } from "../middlewares/authMiddleware"
import { authenticateAdmin } from "../middlewares/adminAuthMiddleware"
import { listarPostagensDoUsuario, 
    listarTodasPostagens, 
    listarPostagensComFiltros,
    criarPostagem,
    editarPostagem,
    deletarPostagem,
    aprovarPostagem,
    desaprovarPostagem,
    obterPostagemPorId


 } from "../controller/postagemController"
import express from 'express'

const router = express.Router()

router.get('/minhas-postagens', authenticateUser, listarPostagensDoUsuario )
router.get('/postagens-admin', authenticateAdmin, listarTodasPostagens )
router.get('/postagens', authenticateUser, listarPostagensComFiltros)
router.get('/postagem', authenticateUser, obterPostagemPorId)

router.post('/criar-post', authenticateUser, criarPostagem)

router.patch('/editar-post/:id-post', authenticateUser, editarPostagem)
router.patch('/aprovar-post/:id-post', authenticateAdmin, aprovarPostagem)
router.patch('/desaprovar-post/:id-post', authenticateAdmin, desaprovarPostagem)

router.delete('/deletar-post/:id-post', authenticateUser, deletarPostagem)



