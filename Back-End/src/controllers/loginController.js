import Usuario from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import sendMail from'../services/nodemailer.js'

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
  const { CPF, nome, email } = req.body

  const senha = '-'

  if (!CPF || !nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' })
  }

  try {
    // Verifica se já existe um usuário com o mesmo CPF e com email validado
    const usuarioExistente = await Usuario.findOne({
      CPF,
      emailisvalid: true
    })
    if (usuarioExistente) {
      return res.status(409).json({ error: 'CPF já está associado a um email confirmado' })
    }

    // Cria o usuário com o status do CPF como pendente e email não validado
    const usuario = await Usuario.create({
      CPF,
      nome,
      email,
      senha,
      categoria: 'Usuario',
      emailisvalid: false,
      CPFStatus: 'pendente'
    })

    // Gera o token para confirmação do email
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const confirmacaoUrl = `${process.env.FRONTEND_URL}/confirmar-email/${token}`

    // Envia o email de confirmação
    await sendMail(email, 'Confirmação de email', `Clique no link para confirmar seu email: ${confirmacaoUrl}`)

    res.status(201).json({ message: 'Usuário criado com sucesso. Verifique seu email para confirmar a conta.' })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
}

export const confirmarEmail = async (req, res) => {
  const { token } = req.params
  const { senha } = req.body

  if (!senha) {
    return res.status(400).json({ error: 'Senha é obrigatória' })
  }

  try {
    // Decodifica o token e busca o usuário
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const usuario = await Usuario.findById(decoded.id)

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    // Verifica se já existe outro usuário com o mesmo email validado
    const emailJaValidado = await Usuario.findOne({
      email: usuario.email,
      emailisvalid: true
    })

    if (emailJaValidado) {
      return res.status(409).json({ error: 'Já existe um usuário com este email validado' })
    }

    // Atualiza a senha e confirma o email e o CPF
    const salt = await bcrypt.genSalt(10)
    const senhaHash = await bcrypt.hash(senha, salt)

    usuario.senha = senhaHash
    usuario.emailisvalid = true
    usuario.CPFStatus = 'confirmado'
    await usuario.save()

    res.status(200).json({ message: 'Email confirmado e senha definida com sucesso.' })
  } catch (error) {
    console.error('Erro ao confirmar email:', error)
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
}





export const esqueceuSenha = async (req, res) => {
  const { email } = req.body

  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' })
    }

    
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const redefinicaoUrl = `${process.env.FRONTEND_URL}/redefinir-senha/${token}`

    
    await sendMail(email, 'Redefinição de senha', `Clique no link para redefinir sua senha: ${redefinicaoUrl}`)

    res.status(200).json({ message: 'Email de redefinição de senha enviado com sucesso.' })
  } catch (error) {
    console.error('Erro ao enviar email de redefinição de senha:', error)
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
}

export const redefinirSenha = async (req, res) => {
  const { token } = req.params
  const { senha } = req.body

  if (!senha) {
    return res.status(400).json({ error: 'Senha é obrigatória' })
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const usuario = await Usuario.findById(decoded.id)

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

   
    const salt = await bcrypt.genSalt(10)
    const senhaHash = await bcrypt.hash(senha, salt)

    usuario.senha = senhaHash
    await usuario.save()

    res.status(200).json({ message: 'Senha redefinida com sucesso.' })
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
}

