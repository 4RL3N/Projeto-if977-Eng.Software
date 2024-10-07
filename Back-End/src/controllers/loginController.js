import Usuario from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const sendMail = require('../services/nodemailer.js')

export const logarUsuario = async (req, res) => {
  const { email, senha } = req.body

  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      
      return res.status(404).json({ message: 'Usuário não encontrado.' })
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' })
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    
    res.status(200).json({ message: 'Login bem-sucedido', token })
  } catch (error) {
    console.error('Erro ao realizar login:', error)
    res.status(500).json({ error: 'Erro ao realizar login', details: error })
  }
}

  export const criarUsuario = async (req, res) => {
    const { CPF, nome, email, senha } = req.body
  
    if (!CPF || !nome || !email || !senha) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' })
    }
  
    try {
      
      const usuarioExistente = await Usuario.findOne({ $or: [{ email }, { CPF }] })
      if (usuarioExistente) {
        return res.status(409).json({ error: 'Usuário com este email ou CPF já existe' })
      }
  
      
      const salt = await bcrypt.genSalt(10)
      const senhaHash = await bcrypt.hash(senha, salt)
  
      
      const usuario = await Usuario.create({
        CPF,
        nome,
        email,
        senha: senhaHash
      })
      
      // confirmar email
      sendMail(email, 'Confirmação de email', 'Clique no link para confirmar seu email.')
      
      res.status(201).json(usuario)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      res.status(500).json({ error: 'Erro interno no servidor.' })
    }
  }


// criar lógica de 'esqueceu senha?' e 'redefinir senha' aqui
export const esqueceuSenha = async (req, res) => {
  const { email } = req.body

  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' })
    }

    // chamar a função sendMail aqui
    sendMail(email, 'Redefinição de senha', 'Clique no link para redefinir sua senha.')

  } catch (error) {
    console.error('Erro ao enviar email de redefinição de senha:', error)
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
}

const sendMail = async (req, res) => {
  const {
    to, subject, text
  } = req.body

  sendMail(to, subject, text)

  return json({ message: 'Email enviado com sucesso.' })
}