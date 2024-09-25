import { authenticateUser } from "../middlewares/authMiddleware";
import { listarDadosUsuario,
    editarUsuario,
    deletarUsuario
} from "../controller/userController";
import express from 'express'

const router = express.Router()

router.get('/dados-usuario', authenticateUser, listarDadosUsuario)

router.patch('/editar-usuario/:id', authenticateUser, editarUsuario)

router.delete('/deletar-usuario/:id', authenticateUser, deletarUsuario)

export default router
