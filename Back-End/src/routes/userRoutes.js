import { listarDadosUsuario,
    editarUsuario,
    deletarUsuario,
    adicionarImagem
} from "../controllers/userController.js"
import { authenticateUser } from "../middlewares/authMiddleware.js"
import express from 'express'
import { handleUploadError } from "../middlewares/handleUploadErrorMiddleware.js"
import { upload } from "../config/multeruser.js"


const router = express.Router()

router.get('/dados-usuario', authenticateUser, listarDadosUsuario)

router.patch('/editar-usuario', authenticateUser, editarUsuario)

router.delete('/deletar-usuario', authenticateUser, deletarUsuario)

router.patch('/adicionar-imagem/:id', authenticateUser, upload, handleUploadError, adicionarImagem)




export default router
