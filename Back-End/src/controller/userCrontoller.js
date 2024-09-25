import Usuario from "../models/User";

export const listarDadosUsuario = async (req, res) => {
    try {
        const usuarios = await Usuario.find({ cliente: req.userId }).populate('CPF', 'contato', 'foto', 'nome', 'desc', 'categoria', 'email')
    
        if (usuarios.length === 0) {
        return res.status(404).json({ message: 'Nenhum usuário encontrado.' })
        }

        res.status(200).json(usuarios)
    }
    catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor.' })
    }
}


export const editarUsuario = async (req, res) => {
    const { id } = req.params
    const { CPF, contato, foto, nome, desc, categoria, email, senha } = req.body

    try{
        const usuario = await Usuario.findOne({ _id: id, cliente: req.userId })

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
    const { id } = req.params

    try {
        const usuario = await Usuario.findOne({ _id: id, cliente: req.userId })

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' })
        }

        await usuario.remove()

        res.status(200).json({ message: 'Usuário deletado com sucesso.' })
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário.' })
    }
}
