import { listarDadosUsuario,
    editarUsuario,
    deletarUsuario
} from "../controller/userController.js"
import { authenticateUser } from "../middlewares/authMiddleware.js"
import express from 'express'

const router = express.Router()

router.get('/dados-usuario', authenticateUser, listarDadosUsuario)

router.patch('/editar-usuario', authenticateUser, editarUsuario)

router.delete('/deletar-usuario', authenticateUser, deletarUsuario)

export default router
