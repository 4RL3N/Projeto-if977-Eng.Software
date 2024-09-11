import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv/config'
import User from '../models/User'


const login = async(req, res, next) => {
  try {
    const { email, senha } = req.body
    const user = await User.findOne({ email })

    if (!user || !await bcrypt.compare(senha, user.senha)) {
      return res.status(401).send({ message: 'Credenciais inválidas' })
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' })
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '60s' })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      path: '/sessions',
      secure: true,
    })

    const { senha: _, ...loggedUser } = user;

    res.locals = {
      status: 200,
      message: 'Usuário logado',
      data: {
        loggedUser,
        accessToken,
      },
    }

    return next()
  } catch (error) {
    return res.status(500).send({ message: 'Erro no servidor' });
  }
}

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token

    if (!refreshToken) {
      delete req.headers.authorization

      return next({
        status: 401,
        message: 'Token inválido',
      })
    }

    const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    if (!decodedRefreshToken) {
      delete req.headers.authorization;

      return next({
        status: 401,
        message: 'token inválido',
      });
    }

    const user = await User.findById(decodedRefreshToken.userId)

    if (!user) {
      return next({
        status: 400,
        message: 'Usuário não encontrado',
      })
    }

    res.cookie("refresh_token", '', {
      httpOnly: true,
      path: '/sessions',
      secure: true,
      maxAge: 0,
    })

    const novoRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' })
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30s' })

    res.cookie('refresh_token', novoRefreshToken, {
      httpOnly: true,
      path: '/sessions',
      secure: true,
    })

    const { senha: _, ...loggedUser } = user

    res.locals = {
      status: 200,
      message: 'Token atualizado',
      data: {
        loggedUser,
        accessToken,
      },
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.cookie("refresh_token", '', {
      httpOnly: true,
      path: '/sessions',
      secure: true,
      maxAge: 0,
    })
    delete req.headers.authorization

    res.locals = {
      status: 200,
      message: 'Usuário deslogado',
    }

    return next()
  } catch (error) {
    return next(error)
  }
}
