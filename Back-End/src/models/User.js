import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  contato: { type: String, required: true },
  CPF: { type: String, required: true },
  foto: { type: String, required: true },
  desc: { type: String, required: true },
  categoria: { type: String, required: true },
  postagens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Postagem' }], // Array de referências a postagens
});

const User = mongoose.model('User', userSchema);
module.exports = User;
