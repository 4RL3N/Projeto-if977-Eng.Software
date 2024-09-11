import { z } from 'zod';


export const PostagemSolicitationSchema = z.object({
  type: z.enum(['CREATE', 'DELETE', 'EDIT'], {
    invalid_type_error: 'O tipo deve ser um dos seguintes: CREATE, DELETE, EDIT',
    required_error: 'O tipo é obrigatório',
  }),
  entity: z.enum(['POSTAGEM'], {
    invalid_type_error: 'A entidade deve ser POSTAGEM',
    required_error: 'A entidade é obrigatória',
  }),
  userId: z.string({
    invalid_type_error: 'O ID do usuário deve ser uma string',
  }).optional(),
  userName: z.string({
    invalid_type_error: 'O nome do usuário deve ser uma string',
    required_error: 'O nome do usuário é obrigatório',
  }),
  userImage: z.string({
    invalid_type_error: 'A imagem do usuário deve ser uma string',
    required_error: 'A imagem do usuário é obrigatória',
  }),
  newData: z.object({
    titulo: z.string({ 
      invalid_type_error: 'O título deve ser uma string',
      required_error: 'O título é obrigatório',
    }),
    desc: z.string({ 
      invalid_type_error: 'A descrição deve ser uma string',
      required_error: 'A descrição é obrigatória',
    }),
    categoria: z.string({ 
      invalid_type_error: 'A categoria deve ser uma string',
      required_error: 'A categoria é obrigatória',
    }),
    valor: z.number({
      invalid_type_error: 'O valor deve ser um número',
      required_error: 'O valor é obrigatório',
    }),
    contato: z.string({ 
      invalid_type_error: 'O contato deve ser uma string',
      required_error: 'O contato é obrigatório',
    }),
    cidade: z.string({ 
      invalid_type_error: 'A cidade deve ser uma string',
      required_error: 'A cidade é obrigatória',
    }),
    estado: z.string({ 
      invalid_type_error: 'O estado deve ser uma string',
      required_error: 'O estado é obrigatório',
    }),
    foto: z.string({ 
      invalid_type_error: 'A foto deve ser uma string',
      required_error: 'A foto é obrigatória',
    }),
    endereco: z.string({ 
      invalid_type_error: 'O endereço deve ser uma string',
      required_error: 'O endereço é obrigatório',
    }),
    autorizada: z.boolean({ 
      invalid_type_error: 'Autorizada deve ser um booleano',
      required_error: 'Autorização é obrigatória',
    }),
  }).optional(),
  currentData: z.object({
    titulo: z.string().optional(),
    desc: z.string().optional(),
    categoria: z.string().optional(),
    valor: z.number().optional(),
    contato: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    foto: z.string().optional(),
    endereco: z.string().optional(),
    autorizada: z.boolean().optional(),
  }).optional(),
  postagemId: z.string({
    invalid_type_error: 'O ID da postagem deve ser uma string',
  }).optional(),
});

export const UpdatePostagemSolicitationSchema = PostagemSolicitationSchema.partial();
