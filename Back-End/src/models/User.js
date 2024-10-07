import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const usuarioSchema = new Schema({
  CPF: { type: String, required: true, unique: true },
  foto: { type: String },
  nome: { type: String, required: true },
  categoria: { type: String, enum: ['Admin', 'Usuario'], required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  postagens: [{ type: _Schema.Types.ObjectId, ref: 'Postagem' }],
  emailisvalid:{type: Boolean},
  CPFStatus:{type: String, required: true}
})

const Usuario = model('Usuario', usuarioSchema)
export default Usuario
