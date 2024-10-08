import Usuario from "../models/User.js"
import Postagem from "../models/Postagem.js"



export const listarDadosUsuario = async (req, res) => {
    try {
      const { userId } = req
      const usuario = await Usuario.findById(userId)
        .populate('CPF')
        .populate('contato')
        .populate('foto')
        .populate('nome')
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
    const { CPF, nome, email, senha, contato, desc } = req.body

    try{
        const usuario = await Usuario.findById({ _id: userId, cliente: req.userId })

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' })
        }

        usuario.CPF = CPF || usuario.CPF
        
      
        usuario.nome = nome || usuario.nome
        usuario.email = email || usuario.email
        usuario.senha = senha || usuario.senha
        usuario.contato = contato || usuario.contato
        usuario.desc = desc || usuario.desc

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
        console.error('Erro ao deletar usuário:', error) 
        res.status(500).json({ error: 'Erro interno ao deletar usuário.' })
    }
}

export const adicionarImagem = async (req, res) => {
  try {
    const {userId} = req
    

    const usuario = await Usuario.findById(userId)

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' })
    }

    usuario.foto.push(req.file.location)

    await usuario.save()

    res.status(200).json(usuario)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao adicionar imagem', detalhe: error.message })
  }
}

