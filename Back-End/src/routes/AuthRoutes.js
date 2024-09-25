import { authenticateUser } from "../middlewares/authMiddleware";
import { criarUsuario,
    deslogarUsuario,
    logarUsuario
 } from "../controller/loginController";
import express from 'express'

const router = express.Router()

router.post('/login', logarUsuario)

router.post('/criar-usuario', criarUsuario)

router.post('/logout', authenticateUser, deslogarUsuario)

export default router
