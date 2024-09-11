import { z } from 'zod';

export const PostagemSchema = z.object({
  id: z.string({ invalid_type_error: 'Id deve ser uma string' }), // De acordo com o modelo Prisma, o id deve ser uma string e o tipo de banco de dados é ObjectId
  titulo: z.string({ invalid_type_error: 'Título deve ser uma string' }),
  desc: z.string({ invalid_type_error: 'Descrição deve ser uma string' }),
  categoria: z.string({ invalid_type_error: 'Categoria deve ser uma string' }),
  valor: z.number({ invalid_type_error: 'Valor deve ser um número' }), // Adaptado para o tipo Int no Prisma
  contato: z.string({ invalid_type_error: 'Contato deve ser uma string' }),
  cidade: z.string({ invalid_type_error: 'Cidade deve ser uma string' }),
  estado: z.string({ invalid_type_error: 'Estado deve ser uma string' }),
  foto: z.string({ invalid_type_error: 'Foto deve ser uma string' }),
  criadoEm: z.date({ invalid_type_error: 'Data de criação deve ser uma data' }), // Adaptado para o tipo DateTime no Prisma
  atualizadoEm: z.date({ invalid_type_error: 'Data de atualização deve ser uma data' }), // Adaptado para o tipo DateTime no Prisma
  endereco: z.string({ invalid_type_error: 'Endereço deve ser uma string' }),
  clienteId: z.string({ invalid_type_error: 'Id do cliente deve ser uma string' }), // Adaptado para o tipo ObjectId no Prisma
  autorizada: z.boolean({ invalid_type_error: 'Autorizada deve ser um booleano' }),
});

export const UpdatePostagemSchema = PostagemSchema.partial();
