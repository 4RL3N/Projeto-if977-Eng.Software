import Usuario from "../models/User.js"
import Postagem from "../models/Postagem.js"
import Usuario from "../models/User.js"
import jwt from 'jsonwebtoken'
import MAIL_USER from "../services/nodemailer.js"
import JWT_SECRET from "../services/nodemailer.js"
import sgMail from '@sendgrid/mail'

export const listarDadosUsuario = async (req, res) => {
    try {
      const { userId } = req
      const usuario = await Usuario.findById(userId)
        .populate('CPF')
        .populate('contato')
        .populate('foto')
        .populate('nome')
        .populate('desc')
        .populate('categoria')
        .populate('email')
  
      if (!usuario) {
        return res.status(404).json({ message: 'Nenhum usuário encontrado.', id: userId })
      }
  
      res.status(200).json(usuario)
    } catch (error) {
      res.status(500).json({ error: 'Erro interno no servidor.', detalhes: error })
    }
  }
  


export const editarUsuario = async (req, res) => {
    const { userId } = req
    const { CPF, contato, foto, nome, desc, categoria, email, senha } = req.body

    try{
        const usuario = await Usuario.findById({ _id: userId, cliente: req.userId })

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' })
        }

        usuario.CPF = CPF || usuario.CPF
        usuario.contato = contato || usuario.contato
        usuario.foto = foto || usuario.foto
        usuario.nome = nome || usuario.nome
        usuario.desc = desc || usuario.desc
        usuario.categoria = categoria || usuario.categoria
        usuario.email = email || usuario.email
        usuario.senha = senha || usuario.senha

        const usuarioSalvo = await usuario.save()

        res.status(200).json(usuarioSalvo)
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao editar usuário.' })
    }
}

export const deletarUsuario = async (req, res) => {
    const { userId } = req

    try {
        const usuario = await Usuario.findById({ _id: userId, cliente: req.userId })

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' })
        }

        
        await Postagem.deleteMany({ cliente: userId })

        
        await usuario.deleteOne()

        res.status(200).json({ message: 'Usuário e suas postagens deletadas com sucesso.' })
    } catch (error) {
        console.error('Erro ao deletar usuário:', error) // Log do erro
        res.status(500).json({ error: 'Erro interno ao deletar usuário.' })
    }
}


// Configurando a chave de API do SendGrid
sgMail.setApiKey(SENDGRID_API_KEY)

// Função para solicitar redefinição de senha (enviar e-mail usando SendGrid)
export const redefinirSenha = async (req, res) => {
  const { email } = req.body

  try {
    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado com esse e-mail.' })
    }

    // Gerar token JWT para redefinição de senha (válido por 1 hora)
    const token = jwt.sign({ userId: usuario._id }, JWT_SECRET, { expiresIn: '1h' })
    const url = `http://localhost:3000/reset-password/${token}`

    // Conteúdo do e-mail
    const msg = {
      to: email, // E-mail do usuário
      from: MAIL_USER, // Seu e-mail registrado no SendGrid
      subject: 'Redefinição de Senha',
      html: `<p>Clique no link para redefinir sua senha: <a href="${url}">Redefinir Senha</a></p>`
    }

    // Enviar o e-mail usando SendGrid
    await sgMail.send(msg)
    res.status(200).json({ message: 'E-mail de redefinição de senha enviado.' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao enviar e-mail de redefinição de senha.', detalhes: error })
  }
}
