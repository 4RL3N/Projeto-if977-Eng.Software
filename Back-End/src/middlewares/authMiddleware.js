import jwt from 'jsonwebtoken'

export const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) return res.status(401).json({ message: 'Acesso negado' })

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(403).json({ message: 'Token inválido' })
  }
}
