const express = require('express');
const router = express.Router();
const solicitacoesController = require('./solicitacoesController');

router.post('/solicitacoes', solicitacoesController.criarSolicitacao);
router.get('/solicitacoes', solicitacoesController.listarSolicitacoes);
router.patch('/solicitacoes/:id/aprovar', solicitacoesController.aprovarSolicitacao);
router.delete('/solicitacoes/:id', solicitacoesController.deletarSolicitacao);

module.exports = router;
