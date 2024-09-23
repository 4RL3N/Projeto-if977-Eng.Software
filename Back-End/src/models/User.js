import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const usuarioSchema = new Schema({
  CPF: { type: String, required: true, unique: true },
  contato: { type: String, required: true },
  foto: { type: String },
  nome: { type: String, required: true },
  desc: { type: String },
  categoria: { type: String, enum: ['Admin', 'Republica', 'Usuario'], required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  postagens: [{ type: _Schema.Types.ObjectId, ref: 'Postagem' }]
})

const Usuario = model('Usuario', usuarioSchema)
export default Usuario
