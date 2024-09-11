import express from 'express'
const router = express.Router()
import { registrar, login, getPerfil } from'../controllers/userController'
import authMiddleware from '../middlewares/authMiddleware'

router.post('/registrar', registrar)
router.post('/login', login)
router.get('/perfil', authMiddleware, getPerfil)

module.exports = router;
