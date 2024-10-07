import { criarUsuario,
    logarUsuario,
    esqueceuSenha,
    redefinirSenha,
    confirmarEmail,

 } from "../controllers/loginController.js"
import express from 'express'

const router = express.Router()

router.post('/login', logarUsuario)

router.post('/criar-usuario', criarUsuario)

router.post('/confirmar-email/:id', confirmarEmail)

router.post('/esqueceu-senha', esqueceuSenha)

router.post('/redefinir-senha/:id', redefinirSenha)

export default router
