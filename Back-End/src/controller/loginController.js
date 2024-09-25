import Usuario from '../models/User.js'

export const logarUsuario = async (req, res) => {
    try {

        const usuarios = await Usuario.find().populate('email', 'senha')

        if (usuarios.length === 0) {
            return res.status(404).json({ message: 'Nenhum usuário encontrado.' })
        }

        res.status(200).json(usuarios)
    } catch (error) {
        console.error('Erro ao listar usuários:', error)
        res.status(500).json({ error: 'Erro interno no servidor.' })
    }
}

export const criarUsuario = async (req, res) => {
    const { CPF, contato, foto, nome, desc, categoria, email, senha } = req.body

    if (!CPF || !contato || !nome || !categoria || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' })
    }

    try {
        const usuario = await Usuario.create({ CPF, contato, foto, nome, desc, categoria, email, senha })
    
        res.status(201).json(usuario)

    } catch (error) {
        console.error('Erro ao criar usuário:', error)
        res.status(500).json({ error: 'Erro interno no servidor.' })
    }
}

export const deslogarUsuario = async (req, res) => {
    try {
        res.status(200).json({ message: 'Usuário deslogado com sucesso.' })
    } catch (error) {
        console.error('Erro ao deslogar usuário:', error)
        res.status(500).json({ error: 'Erro interno no servidor.' })
    }
}
