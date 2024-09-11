import mongoose from 'mongoose'

const postagemSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  desc: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referência ao usuário
  contato: {type: String, required: true},
  categoria: {type: String, required: true},
  cidade: {type: String, required: true},
  estado: {type: String, required: true},
  endereco: {type: String, required: true},
  foto: {type: String, required: true}

})

const Postagem = mongoose.model('Postagem', postagemSchema);
module.exports = Postagem
