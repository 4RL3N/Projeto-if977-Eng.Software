import { listarDadosUsuario,
    editarUsuario,
    deletarUsuario
} from "../controllers/userController.js"
import { authenticateUser } from "../middlewares/authMiddleware.js"
import express from 'express'
import express from 'express'
import { redefinirSenha, novaSenha } from '../controllers/userController.js'

const router = express.Router()

router.get('/dados-usuario', authenticateUser, listarDadosUsuario)

router.patch('/editar-usuario', authenticateUser, editarUsuario)

router.delete('/deletar-usuario', authenticateUser, deletarUsuario)

// Rota para solicitar redefinição de senha
router.post('/forgot-password', redefinirSenha)

// Rota para definir nova senha
router.post('/reset-password/:token', novaSenha)

export default router
