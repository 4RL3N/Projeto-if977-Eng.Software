const { PrismaClient } = require('@prisma/client');
const { PostagemSchema, UpdatePostagemSchema, PostagemSolicitationSchema, UpdatePostagemSolicitationSchema } = require('../DTOs/index')
const prisma = new PrismaClient();

// Função para verificar se o usuário é admin
const verificarAdmin = async (userId) => {
  const usuario = await prisma.cliente.findUnique({ where: { id: userId } });
  if (!usuario || usuario.categoria !== 'Admin') {
    throw new Error('Acesso negado: apenas administradores podem executar essa ação.');
  }
};

// Criar uma nova solicitação
const criarSolicitacao = async (req, res) => {
  try {
    const { clienteId, ...dados } = req.body;

    // Verificar se o cliente é um admin
    await verificarAdmin(clienteId);

    // Validar dados
    const dadosValidados = PostagemSchema.parse(dados);

    // Criar nova postagem (solicitação)
    const novaSolicitacao = await prisma.postagem.create({
      data: {
        ...dadosValidados,
        clienteId,
        autorizada: false, // Por padrão, as solicitações não são autorizadas
      },
    });

    res.status(201).json(novaSolicitacao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todas as solicitações não autorizadas
const listarSolicitacoes = async (req, res) => {
  try {
    const solicitacoes = await prisma.postagem.findMany({
      where: { autorizada: false },
    });
    res.status(200).json(solicitacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar solicitações.' });
  }
};

// Aprovar uma solicitação
const aprovarSolicitacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteId } = req.body;

    // Verificar se o cliente é um admin
    await verificarAdmin(clienteId);

    // Atualizar a solicitação para aprovada
    const solicitacaoAtualizada = await prisma.postagem.update({
      where: { id },
      data: { autorizada: true },
    });

    res.status(200).json(solicitacaoAtualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar uma solicitação
const deletarSolicitacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteId } = req.body;

    // Verificar se o cliente é um admin
    await verificarAdmin(clienteId);

    // Deletar a solicitação
    await prisma.postagem.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Solicitação para alterar uma postagem
const alterarPostagem = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, userImage, newData, currentData } = req.body;

    // Verificar se o cliente é um admin
    await verificarAdmin(userId);

    // Validar solicitação
    const solicitacaoValida = PostagemSolicitationSchema.parse({
      type: 'EDIT',
      entity: 'POSTAGEM',
      userId,
      userName,
      userImage,
      newData,
      currentData,
      postagemId: id,
    });

    // Atualizar postagem
    const postagemAtualizada = await prisma.postagem.update({
      where: { id: solicitacaoValida.postagemId },
      data: solicitacaoValida.newData,
    });

    res.status(200).json(postagemAtualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  criarSolicitacao,
  listarSolicitacoes,
  aprovarSolicitacao,
  deletarSolicitacao,
  alterarPostagem,
};
