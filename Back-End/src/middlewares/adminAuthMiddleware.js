import jwt from 'jsonwebtoken'


export const authenticateAdmin = (req, res, next) => {
  const token = req.headers['Authorization']
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
    req.user = decoded

    
    if (req.user.categoria !== 'Admin') {
      return res.status(403).json({ error: 'Acesso negado. Somente admins podem visualizar esta rota.' })
    }

    next()
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' })
  }
}
