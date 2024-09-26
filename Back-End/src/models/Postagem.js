import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const postagemSchema = new Schema({
  titulo: { type: String, required: true },
  desc: { type: String, required: true },
  categoria: { type: String, required: true },
  valor: { type: Number, required: true },
  contato: { type: String, required: true },
  cidade: { type: String, required: true },
  foto: { type: String },
  criadoEm: { type: Date, default: Date.now },
  atualizadoEm: { type: Date, default: Date.now },
  bairro: { type: String, required: true },
  acomodacao: { 
    type: String, 
    enum: ['Quarto', 'Casa'], 
    required: true 
  },
  tipo_acomodacao: { 
    type: String, 
    enum: ['Individual', 'Compartilhado'], 
    required: true 
  },
  cliente: { type: _Schema.Types.ObjectId, ref: 'Usuario', required: true },
  autorizada: { type: Boolean, default: false },
  motivo: { type: String }
})

const Postagem = model('Postagem', postagemSchema)
export default Postagem
