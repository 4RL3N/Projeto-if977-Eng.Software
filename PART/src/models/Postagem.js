import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const postagemSchema = new Schema({

  desc: { type: String, required: true },
  
  valor: { type: Number, required: true },
 
  cidade: { type: String, required: true },
  fotos: { type: [String] },
  criadoEm: { type: Date, default: Date.now },
  atualizadoEm: { type: Date, default: Date.now },
  universidade: {type: String, required: true},
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
  motivo: { type: String },
  rua:{type: String, required:true},
  numero: {type: String, required: true}
})

const Postagem = model('Postagem', postagemSchema)
export default Postagem
