import express from 'express'
import { authenticateUser } from '../middlewares/authMiddleware.js'
import { authenticateAdmin } from '../middlewares/adminAuthMiddleware.js'

import { upload } from '../config/multer.js' 
import { handleUploadError } from '../middlewares/handleUploadErrorMiddleware.js'
import { listarPostagensDoUsuario, listarTodasPostagens, listarPostagensComFiltros, criarPostagem, deletarPostagem, aprovarPostagem, desaprovarPostagem, obterPostagemPorId, adicionarImagem } from '../controllers/postagemController.js'

const router = express.Router()

router.get('/minhas-postagens', authenticateUser, listarPostagensDoUsuario)
router.get('/postagens-admin', authenticateAdmin, listarTodasPostagens)
router.get('/postagens', authenticateUser, listarPostagensComFiltros)
router.get('/postagem/:id', authenticateUser, obterPostagemPorId)

router.post('/criar-post', authenticateUser, criarPostagem)


router.patch('/aprovar-post/:id', authenticateAdmin, aprovarPostagem)
router.patch('/desaprovar-post/:id', authenticateAdmin, desaprovarPostagem)
router.patch('/adicionar-imagem/:id', authenticateUser, upload, handleUploadError, adicionarImagem)

router.delete('/deletar-post/:id', authenticateUser, deletarPostagem)

export default router
