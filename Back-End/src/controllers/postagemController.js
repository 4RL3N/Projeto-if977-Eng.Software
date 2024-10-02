import Postagem from '../models/Postagem.js'

export const listarTodasPostagens = async (req, res) => {
  try {
    
    const postagens = await Postagem.find().populate('cliente', 'nome contato')

    if (postagens.length === 0) {
      return res.status(404).json({ message: 'Nenhuma postagem encontrada.' })
    }

    res.status(200).json(postagens)
  } catch (error) {
    
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
}


export const listarPostagensDoUsuario = async (req, res) => {
  try {
    const postagens = await Postagem.find({ cliente: req.userId }).populate('cliente', 'nome contato')

    if (!postagens | postagens.length === 0) return res.status(404).json({ message: 'Nenhuma postagem encontrada.' })

    res.status(200).json(postagens)
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor.'})
  }
}

export const listarPostagensComFiltros = async (req, res) => {
  const { cidade, bairro, faculdade, acomodacao, tipo_acomodacao } = req.query
  const filtros = { autorizada: true }

  if (cidade) filtros.cidade = cidade
  if (bairro) filtros.bairro = bairro
  if (faculdade) filtros.faculdade = faculdade
  if (acomodacao) filtros.acomodacao = acomodacao
  if (tipo_acomodacao) filtros.tipo_acomodacao = tipo_acomodacao

  
  try {
    const postagens = await Postagem.find(filtros).populate('cliente', 'nome contato')

    if (postagens.length === 0) return res.status(404).json({ message: 'Nenhuma postagem encontrada.' })
    
   
    res.status(200).json(postagens)
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
}



export const criarPostagem = async (req, res) => {
  const { titulo, desc, categoria, valor, contato, cidade, bairro, acomodacao, tipo_acomodacao} = req.body

  if (!titulo || !desc || !categoria || !valor || !contato || !cidade || !bairro || !acomodacao || !tipo_acomodacao) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' })
  }

  try {
    
    const novaPostagem = new Postagem({
      titulo,
      desc,
      categoria,
      valor,
      contato,
      cidade,
      bairro,
      acomodacao,
      tipo_acomodacao,
      fotos: [], 
      cliente: req.userId
    })

    const postagemSalva = await novaPostagem.save()

    res.status(201).json(postagemSalva)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar postagem', detalhe: error.message || error })
  }
}


export const editarPostagem = async (req, res) => {
  const { id } = req.params
  const { titulo, desc, categoria, valor, contato, cidade, bairro, acomodacao, tipo_acomodacao, foto } = req.body

  try {
    const postagem = await Postagem.findById({ _id: id, cliente: req.userId })

    if (!postagem || postagem.cliente !== req.userId) {
       
      return res.status(404).json({ error: 'Postagem não encontrada ou você não tem permissão para editar' })
    }

    postagem.titulo = titulo || postagem.titulo
    postagem.desc = desc || postagem.desc
    postagem.categoria = categoria || postagem.categoria
    postagem.valor = valor || postagem.valor
    postagem.contato = contato || postagem.contato
    postagem.cidade = cidade || postagem.cidade
    postagem.bairro = bairro || postagem.bairro
    postagem.acomodacao = acomodacao || postagem.acomodacao
    postagem.tipo_acomodacao = tipo_acomodacao || postagem.tipo_acomodacao
    

    const postagemAtualizada = await postagem.save()
    

    res.status(200).json(postagemAtualizada)
  } catch (error) {
    
    res.status(500).json({ error: 'Erro ao atualizar a postagem' })
  }
}

export const deletarPostagem = async (req, res) => {
  const { id } = req.params

  try {
    const postagem = await Postagem.findById({ _id: id, cliente: req.userId })

    if (!postagem) {
      return res.status(404).json({ error: 'Postagem não encontrada ou você não tem permissão para deletar' })
    }

    await postagem.deleteOne()
    res.status(200).json({ message: 'Postagem deletada com sucesso' })
  } catch (error) {
    
    res.status(500).json({ error: 'Erro ao deletar a postagem' })
  }
}


export const aprovarPostagem = async (req, res) => {
  const { id } = req.params
  

  try {
    const postagem = await Postagem.findById(id)
    

    if (!postagem) {
      return res.status(404).json({ error: 'Postagem não encontrada' })
    }

    postagem.autorizada = true
    await postagem.save()

    res.status(200).json({ message: 'Postagem aprovada com sucesso', postagem })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aprovar a postagem' })
  }
}

export const desaprovarPostagem = async (req, res) => {
  const { id } = req.params
  const { motivo } = req.body

  if (!motivo) {
    return res.status(400).json({ error: 'Motivo é obrigatório ao desaprovar a postagem' })
  }

  try {
    const postagem = await Postagem.findById(id)

    if (!postagem) {
      return res.status(404).json({ error: 'Postagem não encontrada' })
    }

    postagem.autorizada = false
    postagem.motivo = motivo
    await postagem.save()

    res.status(200).json({ message: 'Postagem desaprovada com sucesso', postagem })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao desaprovar a postagem' })
  }
}

export const obterPostagemPorId = async (req, res) => {
  const { id } = req.params

  try {
    const postagem = await Postagem.findById(id).populate('cliente')

    if (!postagem) {
      return res.status(404).json({ error: 'Postagem não encontrada' })
    }

    res.status(200).json(postagem)
  } catch (error) {
    
    res.status(500).json({ error: 'Erro ao obter a postagem' })
  }
}


export const adicionarImagem = async (req, res) => {
  try {
    const { id } = req.params
    

    
    const postagem = await Postagem.findById(id)

    if (!postagem) {
      
      return res.status(404).json({ error: 'Postagem não encontrada' })

    }

    
    if (!req.files || req.files.length === 0) {
      

      
      return res.status(400).json({ error: 'Nenhuma imagem enviada' })
    }

    
    req.files.forEach(file => {
      postagem.fotos.push(file.location) 
    })

    
    await postagem.save()

    res.status(200).json(postagem) 
  } catch (error) {
    
    res.status(500).json({ error: 'Erro ao adicionar imagem', detalhe: error.message })
  }
}




