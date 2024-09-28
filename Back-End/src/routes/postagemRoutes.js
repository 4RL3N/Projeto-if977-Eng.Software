import { authenticateUser } from "../middlewares/authMiddleware.js"
import { authenticateAdmin } from "../middlewares/adminAuthMiddleware.js"
import { listarPostagensDoUsuario, 
    listarTodasPostagens, 
    listarPostagensComFiltros,
    criarPostagem,
    editarPostagem,
    deletarPostagem,
    aprovarPostagem,
    desaprovarPostagem,
    obterPostagemPorId


 } from "../controller/postagemController.js"
import express from 'express'

const router = express.Router()

router.get('/minhas-postagens', authenticateUser, listarPostagensDoUsuario )
router.get('/postagens-admin', authenticateAdmin, listarTodasPostagens )
router.get('/postagens', authenticateUser, listarPostagensComFiltros)
router.get('/postagem/:id', authenticateUser, obterPostagemPorId)

router.post('/criar-post', authenticateUser, criarPostagem)

router.patch('/editar-post/:id', authenticateUser, editarPostagem)
router.patch('/aprovar-post/:id', authenticateAdmin, aprovarPostagem)
router.patch('/desaprovar-post/:id', authenticateAdmin, desaprovarPostagem)

router.delete('/deletar-post/:id', authenticateUser, deletarPostagem)

export default router



