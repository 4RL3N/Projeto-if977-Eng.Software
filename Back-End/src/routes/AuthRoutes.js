
import { criarUsuario,
    logarUsuario
 } from "../controller/loginController.js"
import express from 'express'
import { authenticateUser } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post('/login', logarUsuario)

router.post('/criar-usuario', criarUsuario)


export default router
