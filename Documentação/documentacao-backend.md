# Documentação do Backend - Plataforma de acomodação e residência para todos(PART)

## Sumário

-  Visão Geral do Sistema
-  Tecnologias Utilizadas
-  Estrutura de Diretórios
-  Arquitetura do Sistema
-  API Endpoints
-  Banco de Dados
-  Autenticação e Autorização
-  Deploy e Configurações
-  Testes
-  Considerações Finais

___
## 1. Visão Geral do Sistema

O projeto busca trazer uma plataforma para estudantes que estão procurando
moradia próximo a universidade em que estudam, como também busca facilitar
a vida de donos de repúblicas e/ou residências que estão querendo alugar e
anunciar para esse público.

Objetivo: Facilitar a busca e o aluguel de repúblicas estudantis.
Público-Alvo: Estudantes em busca de moradia e donos de imóveis com interesse
em alugar.
___
## 2. Tecnologias Utilizadas

-  Linguagem de programação: Node.js
-  ORM: Prisma
-  Banco de dados: MongoDB
-  Autenticação: JWT (JSON Web Token)
-  Armazenamento de arquivos: AWS S3
-  Testes: Jest e Supertest
___
## 3. Estrutura de Diretórios
 
A pasta src contém a implementação principal do backend, organizada em subpastas para facilitar a modularização e a manutenção do código.

    ## 3.1 Estrutura do Diretório src

          bash
          
          /src
          
          /config
          
          /controllers
          
          /middlewares
          
          /models
          
          /routes
          
          server.js



3.2 config/

3.2.1O arquivo multer.js é responsável pela configuração do upload de
arquivos (fotos) para o serviço de armazenamento em nuvem Amazon
S3, utilizando o pacote multer em conjunto com multer-s3.

 Dependências Importadas
    
    -  S3Client:  Cliente da AWS SDK para interagir com o serviço de armazenamento S3.
    -  crypto : Usado para gerar um nome de arquivo único com base em
    um hash criptográfico.
    -  multer: Middleware para fazer o upload de arquivos em Node.js.
    -  multer-s3: Integração do multer com o Amazon S3.
    -  dotenv: Carrega as variáveis de ambiente de um arquivo .env para
    garantir a segurança e flexibilidade na configuração.
    
Inicialização do Cliente S3
 
      '''let s3
      try {
      s3 = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
      credentials: {
      accessKeyId: process.env.AWS_ACESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACESS_KEY
      }
      })
      } catch (error) {
      console.error(‘Erro ao inicializar o cliente S3:’, error)
      throw new Error(‘Erro ao configurar o serviço de armazenamento
      S3.’)
      }
      '''
-  S3Client: Inicializa o cliente S3, utilizando as credenciais e a região
armazenadas nas variáveis de ambiente.
-  Erro de Inicialização: Caso ocorra um erro ao configurar o cliente S3,
o sistema lança uma exceção com uma mensagem de erro.

 Geração de Nome de Arquivo
const generateFileName = (req, file, cb) => {
crypto.randomBytes(16, (err, hash) => {

Descrição: Autentica o usuário utilizando seu email e senha.

Parâmetros:

-  email (string): Email do usuário.
-  senha (string): Senha do usuário.
-  
Resposta:
-  Status 200: Retorna mensagem de sucesso, token JWT e dados do usuário.
-  Status 404: Usuário não encontrado.
-  Status 401: Senha incorreta.
-  Status 500: Erro no servidor.
-  
Criar Usuário (POST /api/usuario)

Descrição: Cria um novo usuário com CPF pendente e email não validado.

Parâmetros:
-  CPF (string): CPF do usuário.
-  nome (string): Nome do usuário.
-  email (string): Email do usuário.
-  senha (string): Senha (definida automaticamente como ‘-’).
-  
Resposta:
-  Status 201: Usuário criado e email de confirmação enviado.
-  Status 409: CPF já está associado a um email confirmado.
-  Status 400: Falta de campos obrigatórios.
-  Status 500: Erro no servidor.

Confirmar Email (POST /api/confirmar-email/:token)

Descrição: Confirma o email e define uma nova senha para o usuário.

Parâmetros:
-  token (string): Token JWT enviado no email de confirmação.
-  senha (string): Nova senha do usuário.
Resposta:
-  Status 200: Email confirmado e senha definida com sucesso.
-  Status 400: Senha não fornecida.
-  Status 404: Usuário não encontrado.
-  Status 409: Email já validado por outro usuário.
-  Status 500: Erro no servidor.

Esqueceu a Senha (POST /api/esqueci-senha)

Descrição: Gera um token e envia um email para redefinição de senha.
 
Parâmetros:
-  email (string): Email do usuário.
Resposta:
-  Status 200: Email de redefinição de senha enviado.
-  Status 404: Usuário não encontrado.
-  Status 500: Erro no servidor.

Redefinir Senha (POST /api/redefinir-senha/:token)

Descrição: Redefine a senha do usuário usando o token enviado no email.

Parâmetros:
-  token (string): Token JWT enviado no email de redefinição.
-  senha (string): Nova senha do usuário.
Resposta:
-  Status 200: Senha redefinida com sucesso.
-  Status 400: Senha não fornecida.
-  Status 404: Usuário não encontrado.
-  Status 500: Erro no servidor.

3.3.2 controllers/postagemController.js

Listar Todas as Postagens (GET /api/postagens)

Descrição: Retorna todas as postagens com as informações do cliente (nome e
contato) que fez a postagem.

Resposta:
-  Status 200: Lista de postagens.
-  Status 404: Nenhuma postagem encontrada.
-  Status 500: Erro interno no servidor.

 Listar Postagens do Usuário (GET /api/minhas-postagens)
 
Descrição: Retorna todas as postagens feitas pelo usuário autenticado.

Resposta:

-  Status 200: Lista de postagens do usuário.
-  Status 404: Nenhuma postagem encontrada para o usuário.
-  Status 500: Erro interno no servidor.

Listar Postagens com Filtros (GET /api/postagens)

Descrição: Lista as postagens filtradas pelos parâmetros fornecidos (cidade,
bairro, universidade, acomodação, tipo de acomodação).

Parâmetros de Consulta (Query):
-  cidade (string): Filtro pela cidade.
-  bairro (string): Filtro pelo bairro.
-  universidade (string): Filtro pela universidade.
-  acomodacao (string): Tipo de acomodação (casa, apartamento).
-  tipo_acomodacao (string): Tipo de acomodação (individual, compartilhado).
Resposta:
-  Status 200: Lista de postagens filtradas.
-  Status 404: Nenhuma postagem encontrada com os filtros aplicados.
-  Status 500: Erro interno no servidor.

Criar Postagem (POST /api/criar-postagem)

Descrição: Cria uma nova postagem de acomodação para o usuário autenticado.

Parâmetros do Corpo (Body):
-  desc (string): Descrição da postagem.
-  valor (int): Valor do aluguel.
-  cidade (string): Cidade da acomodação.
-  universidade (string): Universidade próxima.
-  bairro (string): Bairro da acomodação.
-  acomodacao (string): Tipo de acomodação (casa, apartamento).
-  tipo_acomodacao (string): Tipo de acomodação (individual, compartilhado).
-  rua (string): Rua da acomodação.
-  numero (string): Número da acomodação.
Resposta:
-  Status 201: Postagem criada com sucesso.
-  Status 400: Campos obrigatórios não preenchidos.
-  Status 500: Erro ao criar a postagem.
Deletar Postagem (DELETE /api/deletar-postagem/:id)

Descrição: Deleta uma postagem pertencente ao usuário autenticado.

Parâmetros de URL:
-  id (string): ID da postagem.
Resposta:
-  Status 200: Postagem deletada com sucesso.
-  Status 404: Postagem não encontrada ou o usuário não tem permissão.
-  Status 500: Erro ao deletar a postagem.
-  
Aprovar Postagem (PATCH /api/aprovar-postagem/:id)

Descrição: Aprova ou reprova uma postagem.

Parâmetros de URL:
-  id (string): ID da postagem.
Parâmetros do Corpo (Body):
-  autorizada (boolean): Define se a postagem é aprovada (true) ou reprovada
(false).
Resposta:
-  Status 200: Postagem aprovada ou reprovada com sucesso.
-  Status 404: Postagem não encontrada.
-  Status 500: Erro ao aprovar a postagem.

Desaprovar Postagem (PATCH /api/desaprovar-postagem/:id)

Descrição: Desaprova uma postagem, adicionando um motivo.

Parâmetros de URL:
-  id (string): ID da postagem.
Parâmetros do Corpo (Body):
-  motivo (string): Motivo da desaprovação.
Resposta:
-  Status 200: Postagem desaprovada com sucesso.
-  Status 400: Motivo é obrigatório.
-  Status 404: Postagem não encontrada.
-  Status 500: Erro ao desaprovar a postagem.

Obter Postagem por ID (GET /api/postagem/:id)

Descrição: Retorna uma postagem específica com os detalhes do cliente.

Parâmetros de URL:
-  id (string): ID da postagem.
Resposta:
-  Status 200: Detalhes da postagem.
-  Status 404: Postagem não encontrada.
-  Status 500: Erro ao obter a postagem.
  
Adicionar Imagens à Postagem (PATCH /api/adicionar-imagens/:id)

Descrição: Adiciona imagens a uma postagem existente.

Parâmetros de URL:
-  id (string): ID da postagem.
Parâmetros do Corpo (Body):
-  Arquivos de imagem.
Resposta:
-  Status 200: Imagens adicionadas com sucesso.
-  Status 400: Nenhuma imagem enviada.
-  Status 404: Postagem não encontrada.
-  Status 500: Erro ao adicionar imagem.
-  
3.3.3 controllers/userController.js
Listar Dados do Usuário (GET /api/usuario/dados)

Descrição: Retorna os dados detalhados do usuário autenticado, incluindo CPF,
nome, email, contato e foto.

Resposta:
-  Status 200: Dados do usuário.
-  Status 404: Nenhum usuário encontrado.
-  Status 500: Erro interno no servidor.
Editar Usuário (PATCH /api/usuario/editar)

Descrição: Permite que o usuário autenticado edite seus dados, como CPF,
nome, email, senha, contato e descrição.

Parâmetros do Corpo (Body):
-  CPF (string): CPF do usuário (opcional).
-  nome (string): Nome do usuário (opcional).
-  email (string): Email do usuário (opcional).
-  senha (string): Nova senha do usuário (opcional).
-  contato (string): Contato do usuário (opcional).
-  desc (string): Descrição do usuário (opcional).
Resposta:
-  Status 200: Usuário atualizado com sucesso.
-  Status 404: Usuário não encontrado.
-  Status 500: Erro ao editar o usuário.
Deletar Usuário (DELETE /api/usuario/deletar)

Descrição: Deleta o usuário autenticado e todas as postagens associadas a ele.

Resposta:
-  Status 200: Usuário e suas postagens deletadas com sucesso.
-  Status 404: Usuário não encontrado.
-  Status 500: Erro ao deletar o usuário.
Adicionar Imagem de Perfil (POST /api/usuario/adicionar-imagem)

Descrição: Permite ao usuário autenticado adicionar uma imagem de perfil.

Parâmetros do Corpo (Body):
-  file (imagem): Arquivo de imagem enviado para ser adicionado ao perfil.
Resposta:
-  Status 200: Imagem adicionada com sucesso.
-  Status 400: Nenhuma imagem enviada.
-  Status 500: Erro ao adicionar imagem.
Autenticação e Autorização
-  Autenticação JWT: O usuário precisa estar autenticado para acessar esses endpoints. O token JWT é utilizado para verificar se o usuário tem permissão para
realizar as ações descritas..
___
## 4. Arquitetura do Sistema
Babel Configuration (babel.config.cjs)
 O arquivo babel.config.cjs contém
 a configuração do Babel, que é uma ferramenta usada para transpilar código
 JavaScript moderno para uma versão compatível com versões mais antigas do
 Node.js.
 
      module.exports = {
      presets: []
      }
-  module.exports: Permite que o arquivo exporte um objeto que contém a
configuração do Babel.
-  presets: Uma matriz que define um conjunto de configurações pré-configuradas
que Babel utilizará para transpilar o código. Neste caso, é utilizado o preset
@babel/preset-env.
-  @babel/preset-env: Este preset permite que você use a versão mais recente do
JavaScript, convertendo o código baseado nas funcionalidades que seu ambiente
de execução suporta. A opção targets especifica qual versão do Node.js será
suportada.
-  targets: Um objeto que define os ambientes de execução que o código deve
suportar. Neste caso, está configurado para o Node.js na versão atual.
-  Jest Configuration (jest.config.cjs) O arquivo jest.config.cjs contém a configuração do Jest, uma ferramenta de teste JavaScript que permite executar
testes em projetos Node.js e front-end.

        module.exports = {
        transform: {
        ‘^.+\.js$’: ‘babel-jest’
        },
        testEnvironment: ‘node’,
        moduleFileExtensions: [‘js’, ‘json’, ‘jsx’, ‘ts’, ‘tsx’, ‘node’],
        transformIgnorePatterns: [‘/node_modules/’],
        }
-  module.exports: Permite que o arquivo exporte um objeto que contém a
configuração do Jest.
-  transform: Um objeto que define como os arquivos são transformados antes de
serem testados.
-  ‘^.+\.js$’: Uma expressão regular que indica que todos os arquivos JavaScript
(com extensão .js) devem ser transformados.
  -  babel-jest’: O transformador que será usado para processar os arquivos
JavaScript, permitindo que o Jest entenda o código moderno usando Babel.
testEnvironment: Especifica o ambiente de execução para os testes. Neste caso,
está configurado para node, que é adequado para testes de aplicativos Node.js.
-  moduleFileExtensions: Uma matriz que define as extensões de arquivo que o
Jest reconhece. Aqui, ele aceita arquivos com as extensões js, json, jsx, ts, tsx
e node.
-  transformIgnorePatterns: Uma matriz que define quais diretórios ou arquivos
devem ser ignorados pelo transformador. A configuração ‘/node_modules/’ significa que o Jest não transformará os arquivos dentro da pasta node_modules.

![arquitetura](https://github.com/user-attachments/assets/a61e84ea-5228-4bf9-a842-7e3387855600)

___
## 5. API Endpoints

Autenticação e Usuários (src/routes/AuthRoutes.js) 

As rotas de autenticação permitem o gerenciamento de usuários, incluindo o processo de login,
criação de contas, recuperação de senhas e validação de e-mails.

POST /login

Descrição: Autentica um usuário com base no email e senha fornecidos.

Corpo da Requisição:
-  email: (String) Email do usuário.
-  senha: (String) Senha do usuário.
Resposta:
-  Sucesso: Retorna um token JWT e uma mensagem de sucesso.
-  Erro: Retorna um status 404 se o usuário não for encontrado ou 401 se a senha
for inválida.

POST /criar-usuario

Descrição: Cria um novo usuário na plataforma.

Corpo da Requisição:
-  CPF: (String) CPF do usuário.
-  nome: (String) Nome do usuário.
-  email: (String) Email do usuário.
Resposta:
-  Sucesso: Retorna uma mensagem solicitando a confirmação do email via link
enviado.

-  Erro: Retorna 409 se o CPF já estiver associado a um email confirmado.

POST /confirmar-email/:token

Descrição: Confirma o email de um usuário usando um token enviado por email.

Parâmetro:
-  token: (String) Token gerado para validação do email.
Corpo da Requisição:
-  senha: (String) Nova senha do usuário.
Resposta:
-  Sucesso: Retorna uma mensagem de sucesso e confirma o email.
-  Erro: Retorna um status 400 se a senha não for fornecida, 404 se o usuário não
for encontrado.

POST /esqueceu-senha

Descrição: Gera um token para redefinir a senha do usuário e envia para o email.

Corpo da Requisição:
-  email: (String) Email do usuário.
Resposta:
-  Sucesso: Retorna uma mensagem de envio do token para redefinir senha.
-  Erro: Retorna 404 se o usuário não for encontrado.

POST /redefinir-senha/:id

Descrição: Permite que o usuário redefina sua senha.

Parâmetro:
-  id: (String) ID do usuário que deseja redefinir a senha.
Corpo da Requisição:
-  senha: (String) Nova senha para o usuário.
Resposta:
-  Sucesso: Retorna uma mensagem de senha alterada com sucesso.
-  Erro: Retorna um status 400 se a senha não for fornecida ou o token for inválido.

PostagemRoutes.js

GET /minhas-postagens

Descrição: Retorna todas as postagens do usuário autenticado.
-  Autenticação: Necessário token de autenticação do usuário.
Resposta:
-  200 OK: Retorna uma lista de postagens do usuário.
-  404 Not Found: Se o usuário não tiver postagens.

GET /postagens-admin

Descrição: Retorna todas as postagens para administração.
-  Autenticação: Necessário token de autenticação de administrador.
Resposta:
-  200 OK: Retorna uma lista de todas as postagens.
-  403 Forbidden: Se o usuário não for um administrador.

GET /postagens

Descrição: Retorna postagens com base em filtros fornecidos.
-  Autenticação: Necessário token de autenticação do usuário.
Resposta:
-  200 OK: Retorna uma lista de postagens filtradas.
-  400 Bad Request: Se os filtros estiverem incorretos.

GET /postagem/

Descrição: Retorna uma postagem específica pelo ID.
-  Autenticação: Necessário token de autenticação do usuário.
Parâmetros:
-  id (String): ID da postagem a ser obtida.
Resposta:
-  200 OK: Retorna os dados da postagem.
-  404 Not Found: Se a postagem não for encontrada.

POST /criar-post

Descrição: Cria uma nova postagem.
-  Autenticação: Necessário token de autenticação do usuário.
Parâmetros:
-  Os parâmetros para criação da postagem devem ser passados no corpo da requisição (verifique no controller os campos obrigatórios).
Resposta:
-  201 Created: Retorna a postagem criada.
-  400 Bad Request: Se os dados obrigatórios não forem fornecidos.

PATCH /aprovar-post/

Descrição: Aprova uma postagem pelo ID.
-  Autenticação: Necessário token de autenticação de administrador.
Parâmetros:
-  id (String): ID da postagem a ser aprovada.
Resposta:
-  200 OK: Postagem aprovada com sucesso.
-  403 Forbidden: Se o usuário não for um administrador.
-  404 Not Found: Se a postagem não for encontrada.

PATCH /desaprovar-post/

Descrição: Desaprova uma postagem pelo ID.
-  Autenticação: Necessário token de autenticação de administrador.
Parâmetros:
-  id (String): ID da postagem a ser desaprovada.
Resposta:
-  200 OK: Postagem desaprovada com sucesso.
-  403 Forbidden: Se o usuário não for um administrador.
-  404 Not Found: Se a postagem não for encontrada.

PATCH /adicionar-imagem/

Descrição: Adiciona uma imagem a uma postagem existente pelo ID.
-  Autenticação: Necessário token de autenticação do usuário.
Parâmetros:
-  id (String): ID da postagem à qual a imagem será adicionada.

Middleware:
-  upload: Middleware responsável pelo upload da imagem.
handleUploadError: Middleware para tratar erros de upload.
Resposta:
-  200 OK: Retorna a postagem atualizada com a nova imagem.
-  400 Bad Request: Se houver erro no upload da imagem.
-  404 Not Found: Se a postagem não for encontrada.

DELETE /deletar-post/

Descrição: Deleta uma postagem pelo ID.
-  Autenticação: Necessário token de autenticação do usuário.
Parâmetros:
-  id (String): ID da postagem a ser deletada.
Resposta:
-  200 OK: Postagem deletada com sucesso.
-  404 Not Found: Se a postagem não for encontrada.

UserRoutes.js

GET /dados-usuario

Descrição: Retorna os dados do usuário autenticado.
-  Autenticação: Necessário token de autenticação do usuário.
Resposta:
-  200 OK: Retorna os dados do usuário.
-  404 Not Found: Se o usuário não for encontrado.

PATCH /editar-usuario

Descrição: Edita os dados do usuário autenticado.
-  Autenticação: Necessário token de autenticação do usuário.
Parâmetros:
-  Os dados a serem atualizados devem ser enviados no corpo da requisição.
Resposta:
-  200 OK: Retorna os dados atualizados do usuário.
-  400 Bad Request: Se os dados fornecidos forem inválidos.

-  404 Not Found: Se o usuário não for encontrado.

DELETE /deletar-usuario

Descrição: Deleta a conta do usuário autenticado.
-  Autenticação: Necessário token de autenticação do usuário.
Resposta:
-  200 OK: Confirmação da exclusão da conta.
-  404 Not Found: Se o usuário não for encontrado.

PATCH /adicionar-imagem/

Descrição: Adiciona uma imagem ao perfil do usuário autenticado.
-  Autenticação: Necessário token de autenticação do usuário.
Parâmetros:
-  A imagem deve ser enviada como arquivo no corpo da requisição.
Middleware:
-  upload: Middleware responsável pelo upload da imagem.
-  handleUploadError: Middleware para tratar erros de upload.
Resposta:
-  200 OK: Retorna os dados atualizados do usuário com a imagem.
-  400 Bad Request: Se houver erro no upload da imagem.
-  404 Not Found: Se o usuário não for encontrado.
-  ___
## 6. Banco de Dados
Prisma Schema

O Prisma é utilizado para fazer a interface entre o backend e o banco de dados
MongoDB no projeto. Abaixo está a explicação sobre os modelos definidos no
arquivo schema.prisma.

Gerador de Cliente

      generator client {
      provider = “prisma-client-js”
      }

O gerador client especifica o uso do prisma-client-js, uma biblioteca que permite
a interação com o banco de dados via código JavaScript/TypeScript. Este cliente
é gerado automaticamente a partir do schema.

Configuração da Fonte de Dados
      datasource db {
      provider = “mongodb”
      url = env(“DATABASE_URL”)
      }
-  provider: O banco de dados utilizado é o MongoDB.
-  url: A URL de conexão com o banco de dados está armazenada na variável de
ambiente DATABASE_URL para segurança e flexibilidade.

Modelo Cliente

      model Cliente {
      id String @id @default(auto()) @map(“_id”) @db.ObjectId
      CPF String @unique
      foto String[]
      nome String
      email String
      senha String
      categoria String @default(“Usuario”)
      emailisvalid Boolean @default(false)
      CPFStatus String
      postagens Postagem[]
      contato String @default(“undefined”)
      desc String
      }
-  id: Identificador único do cliente, representado como um ObjectId do MongoDB.
-  CPF: Campo único que armazena o CPF do cliente.
-  foto: Lista de URLs de fotos do cliente.
-  nome: Nome completo do cliente.
-  email: Email do cliente.
-  senha: Senha do cliente, armazenada em formato seguro (criptografada).
-  categoria: Indica o tipo de cliente, sendo o valor padrão “Usuario”.
-  emailisvalid: Um campo booleano que indica se o email foi validado, com valor
padrão false.
-  CPFStatus: Status do CPF do cliente.
-  postagens: Relação com o modelo Postagem, indicando as postagens feitas pelo
cliente.
-  contato: Informação de contato, com valor padrão “undefined”.
desc: Descrição adicional do cliente.

Modelo Postagem

      model Postagem {
      id String @id @default(auto()) @map(“_id”) @db.ObjectId
      titulo String
      desc String
      categoria String
      valor Int
      contato String
      cidade String
      fotos String[]
      criadoEm DateTime @default(now())
      atualizadoEm DateTime @updatedAt
      bairro String
      universidade String
      acomodacao String
      tipo_acomodacao String
      cliente Cliente @relation(fields: [clienteId], references: [id])
      clienteId String @db.ObjectId
      autorizada Boolean @default(false)
      motivo String?
      }
-  id: Identificador único da postagem, representado como um ObjectId do MongoDB.
-  titulo: Título da postagem.
-  desc: Descrição do anúncio.
-  categoria: Categoria da postagem (ex: aluguel, venda).
-  valor: Valor monetário associado à postagem (ex: aluguel mensal).
-  contato: Informação de contato do anunciante.
-  idade: Cidade onde a acomodação está localizada.
-  fotos: Lista de URLs das fotos associadas à postagem.
-  criadoEm: Data e hora da criação da postagem. Valor padrão é o momento
atual.
-  atualizadoEm: Data e hora da última atualização da postagem. Atualiza automaticamente.
-  bairro: Bairro onde a acomodação está localizada.
-  universidade: Universidade mais próxima da residência.
-  acomodacao: Tipo de acomodação oferecida (ex: quarto, apartamento).
-  tipo_acomodacao: Categoria da acomodação (ex: compartilhada, individual).
-  cliente: Relação com o modelo Cliente, representando o proprietário da
postagem.
-  clienteId: Referência ao campo id do modelo Cliente.-  
-  autorizada: Indica se a postagem foi autorizada pela plataforma, com valor
padrão false.
-  motivo: Motivo da recusa da autorização (se aplicável).
-  
Modelo de Postagem (src/models/Postagem.js)

O modelo de Postagem define as entidades relacionadas às publicações de
repúblicas e residências na plataforma. Ele contém as seguintes propriedades:

-  titulo: (String, obrigatório) — O título da postagem.
-  desc: (String, obrigatório) — Descrição detalhada da república ou residência.
-  categoria: (String, obrigatório) — A categoria da postagem, podendo ser usada
para filtrar tipos de acomodações.
-  valor: (Number, obrigatório) — O valor mensal do aluguel.
-  contato: (String, obrigatório) — Informações de contato do anunciante.
-  cidade: (String, obrigatório) — A cidade onde a acomodação está localizada.
-  fotos: (Array de Strings) — URLs das imagens da propriedade.
-  criadoEm: (Date, padrão: Date.now) — A data de criação da postagem.
-   tualizadoEm: (Date, padrão: Date.now) — A data da última atualização da
postagem.
-  universidade: (String, obrigatório) — A universidade mais próxima da residência.
-  bairro: (String, obrigatório) — O bairro onde a propriedade está localizada.
-  acomodacao: (String, obrigatório) — O tipo de imóvel: ‘Quarto’ ou ‘Casa’.
-  tipo_acomodacao: (String, obrigatório) — O tipo de acomodação: ‘Individual’
ou ‘Compartilhado’.
-  cliente: (ObjectId, obrigatório) — Referência ao cliente (usuário) que fez a
postagem.
-  autorizada: (Boolean, padrão: false) — Indica se a postagem foi autorizada
para exibição.
-  motivo: (String, opcional) — Motivo da recusa da postagem, se houver.
-  
Esse modelo é utilizado para representar as postagens na plataforma, vinculadas a um cliente (usuário), e controladas por um sistema de autorização de
postagem.

Modelo de Usuário (src/models/User.js)

O modelo de Usuário define as entidades relacionadas aos usuários da
plataforma, sejam eles administradores ou usuários regulares. Ele contém as
seguintes propriedades:

-  CPF: (String, obrigatório, único) — O CPF do usuário, usado como identificador
único.
-  foto: (Array de Strings) — URLs das fotos de perfil do usuário.
-  nome: (String, obrigatório) — O nome completo do usuário.
-  categoria: (String, obrigatório) — A categoria do usuário, que pode ser ‘Admin’
-  (administrador) ou ‘Usuario’ (usuário regular).
-  email: (String, obrigatório) — O email do usuário.
-  senha: (String, obrigatório) — A senha do usuário, armazenada de forma segura.
-  postagens: (Array de ObjectId) — Referências às postagens associadas ao
usuário (ligadas ao modelo Postagem).
-  emailisvalid: (Boolean) — Indica se o email do usuário foi validado.
=  CPFStatus: (String, obrigatório) — O status do CPF do usuário, que pode ser,
por exemplo, “confirmado” ou “pendente”.
-  contato: (String) — Informações de contato adicionais fornecidas pelo usuário.
-  desc: (String) — Descrição adicional sobre o usuário, como uma bio ou resumo.

Esse modelo é utilizado para representar os usuários na plataforma, gerenciar
suas permissões e associá-los às postagens que criam.
___
## 7.Autenticação e Autorização

Middleware: adminAuthMiddleware.js

Este middleware é responsável
por autenticar e autorizar usuários com a função de administrador para acessar
rotas restritas no sistema.

O middleware verifica se o usuário está autenticado com um token JWT válido e
se possui a categoria de “Admin”. Se a autenticação for bem-sucedida e o usuário
for um administrador, o middleware permite o acesso à rota; caso contrário, o
acesso é negado.

Token JWT: O middleware espera que o cliente envie um token JWT no
cabeçalho Authorization, no formato Bearer . O token é utilizado para
autenticar o usuário e extrair seu userId.

Verificação de Admin: Após a autenticação, o middleware busca o usuário no
banco de dados e verifica se sua categoria é “Admin”. Se não for, o acesso à rota
é negado.

Erros Possíveis:
-  401 Unauthorized: Token não fornecido ou mal formatado.
-  403 Forbidden: Token inválido ou o usuário não tem permissão de administrador.
-  500 Internal Server Error: Erro inesperado no processo de verificação.

Middleware: authMiddleware.js 

Este middleware é responsável por autenticar os usuários em rotas que requerem um token JWT válido. Ele verifica a
presença do token JWT no cabeçalho de autorização e o decodifica para permitir
o acesso à rota.

O authMiddleware garante que apenas usuários autenticados possam acessar
determinadas rotas da aplicação. Ele verifica o token JWT no cabeçalho Authorization e, se o token for válido, extrai o userId para ser usado nas próximas
operações.

Token JWT: O middleware espera que o token JWT seja enviado no cabeçalho
Authorization, no formato Bearer . Este token é decodificado para extrair o
userId do usuário autenticado.

Verificação do Token: Caso o token seja válido, o middleware armazena o userId
no objeto req e chama next() para prosseguir com a execução da rota. Caso o
token seja inválido ou ausente, a requisição é bloqueada.
Erros Possíveis:
-  401 Unauthorized: Token não fornecido ou ausente.
-  403 Forbidden: Token inválido ou expirado.

Middleware: handleUploadErrorMiddleware.js

Este middleware lida com erros que ocorrem durante o upload de arquivos,
capturando erros específicos do multer, como tamanho de arquivo excedido ou
tipos de arquivos inválidos.

O middleware handleUploadError intercepta erros gerados durante o upload de
arquivos, fornecendo respostas adequadas para o cliente em caso de falhas no
processo de upload.
Erros de Upload:
-  Captura e trata erros gerados pela biblioteca multer, que é usada para upload
de arquivos.
Detecta erros comuns como:
-  Excesso de tamanho de arquivo.
-  Tipos de arquivos inválidos.
Erros Específicos:
-  Erro MulterError: Este erro ocorre quando o arquivo excede o limite de tamanho
configurado ou outros erros relacionados ao multer.
-  Erro INVALID_FILE_TYPE: Caso o tipo de arquivo enviado não seja permitido.
-  Outros Erros: Para erros não cobertos diretamente pelo multer, uma resposta
genérica de erro interno é retornada.
Tratamento de Erros:
-  Retorna uma mensagem de erro apropriada dependendo do tipo de erro.
-  Se nenhum erro ocorrer, a requisição segue para o próximo middleware ou controlador.
Respostas Erro 400 - Upload Inválido:
-  Caso o erro seja relacionado ao multer (ex: tamanho do arquivo ou tipo inválido),
o middleware retorna um erro com uma mensagem informativa.
Exemplo de resposta para um arquivo muito grande:
      {
      “error”: “Erro no upload: Tamanho do arquivo excedido ou outro erro relacionado.”
      }

Exemplo de resposta para tipo de arquivo inválido: {
      “error”: “Tipo de arquivo inválido.”
      }
      
Erro 500 - Erro Interno:

Caso um erro inesperado ocorra, o middleware retorna uma mensagem de erro
genérica:
      {
      “error”: “Erro interno ao processar o upload. Tente novamente mais tarde.”,
      “details”: “Detalhes do erro.”
      }
___
## 8. Deploy e Configurações
Configuração do Servidor 

O servidor é construído usando o Express e é
responsável por gerenciar as rotas e a conexão com o banco de dados. 

As seguintes configurações são realizadas no arquivo server.js:

Importação de Módulos:
-  express: Framework para a criação do servidor.
-  dotenv/config: Para carregar variáveis de ambiente.
-  mongoose: ODM para interagir com o MongoDB.

Configuração do Servidor:

Um novo aplicativo Express é criado usando express().
O middleware express.json() é utilizado para analisar o corpo das requisições
em formato JSON.

Rotas:

As seguintes rotas são registradas:

/api/login (AuthRoutes)

/api/criar-usuario (AuthRoutes)

/api/dados-usuario (userRoutes)

/api/editar-usuario (userRoutes)

/api/deletar-usuario (userRoutes)

/api/minhas-postagens (postagemRoutes)

/api/criar-post (postagemRoutes)

/api/editar-post/:id (postagemRoutes)

/api/deletar-post/:id (postagemRoutes)

Entre outras.

Conexão com o MongoDB:

O servidor tenta se conectar ao MongoDB usando a URL definida na variável
de ambiente DATABASE_URL.

Logs são gerados para indicar o status da conexão (sucesso ou erro).

Inicialização do Servidor:

O servidor escuta na porta especificada na variável de ambiente PORT, ou na
porta 3000 por padrão.

## 9. Testes

config.spec.js

Objetivo: Este arquivo contém testes unitários para a configuração de upload de arquivos do projeto, utilizando o Jest como framework de testes. Ele
simula o comportamento de alguns módulos e funções para verificar a correta
implementação da funcionalidade de upload.

Descrição dos Testes: S3 Client Configuration Test:

Verifica se o cliente S3 está sendo configurado corretamente com as credenciais
e a região do AWS definidas nas variáveis de ambiente.

File Name Generation Test:

Testa a geração do nome dos arquivos ao fazer upload, garantindo que o nome
seja composto por um hash seguido do nome original do arquivo.

File Name Hash Generation Failure Test:

Simula a falha na geração do hash para o nome do arquivo e garante que a
função de callback retorne um erro apropriado ao tentar processar o arquivo.

Valid File Types Test:

Verifica se a filtragem de tipos de arquivos aceita apenas arquivos com extensões
válidas (JPEG, PNG, JPG).

Invalid File Types Test:

Testa se arquivos de tipos inválidos (ex: PDF) são corretamente rejeitados,
retornando um erro com a mensagem e código específicos.

Módulos e Dependências: crypto: Simulado para testar a geração do hash
dos arquivos.

S3Client (AWS SDK): Simulado para testar a configuração do cliente de upload
para a AWS.

multerS3: Simulado para testar a funcionalidade de upload utilizando o S3 da
AWS.

upload: Importado da configuração do multer (para upload de arquivos).
Metodologias e Abordagens Utilizadas: Mocking: Através de jest.mock()
para simular comportamentos de módulos externos, como crypto, S3Client e
multerS3.

Callback Handling: Testes que envolvem o uso de callbacks (especialmente com
o multer) para verificar o fluxo de tratamento de erros e sucesso.

middlewares.spec.js

Objetivo: Este arquivo contém testes unitários para os middlewares do projeto. Os middlewares testados incluem autenticação de usuários, autenticação
de administradores e o tratamento de erros durante o upload de arquivos.

Descrição dos Testes: Middleware: authenticateAdmin:

Verifica se o token de autenticação do administrador é fornecido:
-  Caso o token não seja fornecido, deve retornar um erro 401 (Token não
fornecido).
Verifica a validade do token de autenticação:
-  Se o token for inválido, retorna um erro 403 (Token inválido).
Verifica se o usuário autenticado é um administrador:
-  Caso o usuário não seja um admin, retorna um erro 403 (Acesso negado. Somente admins podem visualizar esta rota.).
Se o usuário for admin e o token for válido, chama next().

Middleware: authenticateUser:

Verifica se o token de autenticação é fornecido:

Caso o token não seja fornecido, retorna um erro 401 (Acesso negado).

Verifica a validade do token:

Se o token for inválido, retorna um erro 403 (Token inválido).

Se o token for válido, define o userId no req e chama next().

Middleware: handleUploadError:

Erros do Multer (tamanho de arquivo excedido, etc.):

Caso ocorra um erro de tamanho ou outro erro específico do Multer, retorna
um erro 400 (Erro no upload: Tamanho do arquivo excedido ou outro erro
relacionado.).

Erros de tipo de arquivo inválido:

Retorna um erro 400 (Tipo de arquivo inválido).

Erros gerais de upload:

Retorna um erro 500 (Erro interno ao processar o upload. Tente novamente
mais tarde.).

Se não houver erro, chama next().

Módulos e Dependências: jsonwebtoken: Simulado para testar a verificação
de tokens de autenticação.

Usuario (User model): Simulado para verificar se o usuário possui permissão de
administrador.

multer: Simulado para tratar erros relacionados ao upload de arquivos.

Metodologias e Abordagens Utilizadas: Mocking: Utilizado para simular
o comportamento de módulos externos como jsonwebtoken, Usuario, e multer.

Callback Handling: Testes que envolvem o uso de callbacks nos middlewares
para verificar o fluxo de erros e sucesso.

postagemController.spec.js

Descrição

Este arquivo contém testes unitários e de integração para o controlador de
postagens, garantindo que as funcionalidades de aprovar, desaprovar, obter e
adicionar imagens a postagens funcionem corretamente.

Estrutura dos Testes

Bloco: Aprovar Postagem

Funções Testadas aprovarPostagem

Testes Deve aprovar a postagem com sucesso.

Valida se a postagem é aprovada corretamente e retorna um status 200.

Deve retornar 400 se a postagem não for encontrada

Testa o retorno de erro 404 quando a postagem não existe.

Deve retornar 500 em caso de erro no servidor

Garante que um erro interno do servidor retorne um status 500.

Bloco: Desaprovar Postagem.

Funções Testadas desaprovarPostagem.

Testes Deve desaprovar a postagem com sucesso.

Valida a desaprovação de uma postagem e o retorno correto de status e mensagem.

Deve retornar 400 se o motivo não for fornecido.

Testa a ausência do motivo e assegura que um erro 400 é retornado.

Deve retornar 404 se a postagem não for encontrada.

Garante que o sistema retorna 404 para postagens inexistentes.

Deve retornar 500 em caso de erro no servidor

Valida a resposta ao ocorrer um erro interno durante o processamento.

Bloco: Obter Postagem por ID

Funções Testadas obterPostagemPorId

Testes Deve retornar 200 e a postagem quando encontrada

Verifica se a postagem é retornada corretamente com status 200.

Deve retornar 404 se a postagem não for encontrada

Garante que um erro 404 é retornado se a postagem não existe.
Deve retornar 500 em caso de erro no servidor

Valida o retorno de um erro 500 para falhas internas no servidor.

Bloco: Adicionar Imagem

Funções Testadas adicionarImagem

Testes Deve retornar 404 se a postagem não for encontrada

Testa a resposta quando a postagem é inexistente, esperando um erro 404.

Deve retornar 400 se nenhuma imagem for enviada

Valida que um erro 400 é retornado se nenhuma imagem é fornecida na requisição.

Deve adicionar imagens e retornar a postagem

Confirma que as imagens são adicionadas corretamente e a postagem é retornada
com sucesso.

Deve retornar 500 em caso de erro no servidor

Garante que um erro interno no servidor é tratado corretamente.

server.spec.js

Descrição

Este arquivo contém testes unitários e de integração para o servidor da aplicação, utilizando a biblioteca supertest para simular requisições HTTP. Os
testes abrangem a autenticação de usuários e o tratamento de rotas inexistentes.

Estrutura dos Testes

Configuração do Teste

Conexão com o Banco de Dados:

O teste inicia conectando-se ao banco de dados MongoDB usando a URL
definida em process.env.DATABASE_URL durante a fase beforeAll.

Fechamento da Conexão:

Após todos os testes, a conexão com o banco de dados é fechada na fase afterAll.

Bloco: Testes Unitários do Servidor

Funções Testadas Autenticação de usuários

Tratamento de rotas

Testes Deve retornar 200 e mensagem de sucesso para rota de autenticação

Método: POST

Rota: /api/login

Corpo da Requisição: 
      {
      
      “email”: “gustavo@example2.com”,
      
      “senha”: “12345678”
      }

Expectativas:

Status: 200

Mensagem: “Login bem-sucedido”

Deve retornar 404 para rota inexistente

Método: GET

Rota: /api/rota_inexistente

Expectativas:

Status: 404

Bloco: Testes de Integração do Servidor

Funções Testadas Integração da autenticação com a aplicação

Testes Deve retornar 200 e mensagem de sucesso para rota de autenticação

Método: POST

Rota: /api/login

Corpo da Requisição: 
      {
      
      “email”: “gustavo@example2.com”,
      
      “senha”: “12345678”
      }

Expectativas:

Status: 200

Mensagem: “Login bem-sucedido”
___
## 10. Considerações Finais
O sistema de aluguel de repúblicas para estudantes desenvolvido oferece uma
solução robusta para facilitar a conexão entre estudantes que buscam moradia
e proprietários de imóveis. Através de uma arquitetura bem estruturada, o
backend utiliza tecnologias modernas como Node.js, Express.js, MongoDB, e
Prisma ORM, além de integrar serviços como o AWS S3 para armazenamento de
imagens e o nodemailer para envio de emails, proporcionando uma experiência
fluida e escalável.

Durante o desenvolvimento, foram implementados mecanismos de autenticação
seguros com JWT, além de uma API bem documentada e testada, garantindo
a integridade e a segurança dos dados dos usuários. Os testes unitários e de
integração desempenham um papel fundamental na validação do sistema, assegurando que as principais funcionalidades operem conforme esperado.

Próximos Passos e Manutenção Escalabilidade: Com o crescimento da
base de usuários, será importante monitorar o desempenho do sistema, especialmente na parte de armazenamento e consulta de dados. A implementação de
técnicas como caching e otimizações no banco de dados podem ser consideradas
para aumentar a performance.

Segurança: Continuar monitorando as práticas de segurança, como a revisão
periódica dos pacotes utilizados, proteção contra ataques de injeção de código
e implementação de medidas mais rígidas de controle de acesso para garantir a
privacidade dos usuários.

Melhorias Futuras:
Sistema de Recomendação: Implementar um sistema que sugira repúblicas com
base no perfil do estudante, utilizando técnicas de machine learning.
Avaliação de Imóveis: Permitir que os usuários avaliem as repúblicas após sua
estadia, oferecendo um feedback público para futuros interessados.

Notificações em Tempo Real: Incorporar notificações push ou em tempo real
para alertar os usuários sobre atualizações em suas postagens ou interações com
outros usuários.

Manutenção e Suporte: O sistema deve contar com um plano de manutenção
contínua, incluindo atualizações de segurança, correção de bugs e melhorias na
experiência do usuário. Um ambiente de staging pode ser útil para testar novas
funcionalidades antes do lançamento oficial.

Este projeto oferece uma base sólida, mas a evolução contínua é necessária para
garantir que ele atenda às demandas de seus usuários e do mercado. Com melhorias constantes, o sistema pode se tornar uma plataforma ainda mais completa
e escalável.
