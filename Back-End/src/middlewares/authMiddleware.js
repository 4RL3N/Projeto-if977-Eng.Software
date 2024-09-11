import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).send({ message: 'Token não autorizado' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'token inválido' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
