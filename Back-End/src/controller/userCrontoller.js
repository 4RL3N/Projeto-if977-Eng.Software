import bcrypt from 'bcryptjs'

import User from '../models/User'


const registrar = async (req, res) => {
  const { email, senha } = req.body
  const hashedSenha = await bcrypt.hash(senha, 10)
  const user = new User({ email, senha: hashedSenha })
  await user.save()
  res.status(201).send({ message: 'Usuário registrado' })
}



const deletar = async (req, res) =>{
  pass
}

const getPerfil = async (req, res) => {
  const user = await User.findById(req.user.userId)
  res.send({
    
     email: user.email,
     contato: user.contato,
     nome: user.nome,
     CPF: user.CPF,
     categoria: user.categoria,
     postagens: user.postagens,
     desc: user.desc,

  })
}

module.exports = { registrar, getPerfil }
