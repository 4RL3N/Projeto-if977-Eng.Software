# Use uma imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e package-lock.json da raiz
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install --production

# Copia o restante do código da aplicação (src/ e prisma/)
COPY . .

# Gera o cliente Prisma (especificando o caminho correto)
RUN npx prisma generate --schema=./prisma/schema.prisma

# Exponha a porta em que o app será executado
EXPOSE 4000

# Inicia o app
CMD ["node", "src/server.js"]
