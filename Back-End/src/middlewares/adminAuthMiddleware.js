import jwt from 'jsonwebtoken'
import Usuario from '../models/User.js'


export const authenticateAdmin = async (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
    req.userId = decoded.id

    const user = await Usuario.findById(req.userId)
    if (user.categoria !== 'Admin') {
      return res.status(403).json({ error: 'Acesso negado. Somente admins podem visualizar esta rota.' })
    }

    next()
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido', details: error })
  }
}
