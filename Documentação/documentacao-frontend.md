# Documentação do Front-End - Projeto de Aluguel de Repúblicas para Estudantes

## Sumário
- [Visão Geral do Sistema](#visão-geral-do-sistema)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Considerações Finais](#considerações-finais)

---

## 1. Visão Geral do Sistema

Uma breve descrição do projeto, o que ele faz e como o Front-End suporta a funcionalidade. Explique que se trata de uma plataforma de aluguel de repúblicas para estudantes, onde os usuários podem ver e anunciar repúblicas, similar a plataformas como Trivago e OLX.

- **Objetivo:** Facilitar a busca e o aluguel de repúblicas estudantis.
- **Público-Alvo:** Estudantes em busca de moradia e donos de imóveis com interesse em alugar.

---

## 2. Tecnologias Utilizadas

O front-end do sistema foi desenvolvido utilizando um conjunto de tecnologias modernas e amplamente utilizadas para aplicações web. Abaixo está a lista de tecnologias aplicadas:

- **Linguagem de Programação:** JavaScript  
  - Função: Utilizado para criar interatividade nas páginas, gerenciar estados, realizar chamadas à API e manipular o DOM.
  - Razão: Versatilidade, ampla adoção web e capacidade de executar tanto no navegador quanto no servidor.
  
- **HTML e CSS:**  
  - Função: HTML para estruturar o conteúdo das páginas, incluindo formulários, listas e seções. CSS para estilizar os elementos, criar layouts responsivos e manter uma identidade visual consistente.
  - Razão: Padrões fundamentais para desenvolvimento web, oferecendo controle preciso sobre a estrutura e aparência das páginas.

---

## 3. Estrutura de Diretórios

A pasta `src/view` contém a implementação principal do Front-End, organizada em subpastas para facilitar a modularização e a manutenção do código.

### Estrutura dos Arquivos HTML

Os arquivos HTML seguem uma estrutura consistente, incluindo:

- Declaração `DOCTYPE` e tags `html`, `head` e `body`
- Metadados como charset e viewport
- Título da página e link para o arquivo CSS correspondente
- Uma barra lateral (sidebar) com links de navegação
- Uma área de conteúdo principal com um título e elementos específicos da página
- Scripts JavaScript vinculados no final do `body`

#### Exemplo de HTML:
```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aprovações</title>
    <link rel="stylesheet" href="aprovacoes.css">
</head>
<body>
    <div class="sidebar">
        <!-- Links de navegação -->
    </div>
    <div class="main-content">
        <h1>Aprovações Pendentes</h1>
        <!-- Conteúdo específico da página -->
    </div>
    <script src="aprovacoes.js"></script>
</body>
</html>
```

### Estrutura dos Arquivos CSS

Os arquivos CSS mantêm um estilo coerente em todo o projeto:

- Layout flexbox para organização geral da página
- Estilização consistente da barra lateral, incluindo cores, fontes e efeitos hover
- Área de conteúdo principal com espaçamento e largura adequados
- Estilização de elementos comuns como cards, botões e formulários
- Uso de cores específicas (principalmente tons de vermelho) para manter a identidade visual
- Responsividade para adaptação a diferentes tamanhos de tela

#### Exemplo de CSS:
```css
.sidebar {
    display: flex;
    flex-direction: column;
    background-color: #e74c3c;
    padding: 20px;
}

.main-content {
    margin-left: 200px;
    padding: 20px;
    flex-grow: 1;
}

button {
    background-color: #c0392b;
    color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #e74c3c;
}

```
## 1. /private/autorizacao/aprovacoes.js

### 1.1 Obtenção de postagens

```js
const response = await fetch('http://localhost:4000/api/postagens-admin', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
```
**Esta requisição** `GET` **busca todas as postagens pendentes de aprovação do administrador.**

### 1.2 Aprovar ou Desaprovar Postagem

```js
const url = isApproved 
    ? `http://localhost:4000/api/aprovar-post/${postId}`
    : `http://localhost:4000/api/desaprovar-post/${postId}`;
const response = await fetch(url, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ autorizada: isApproved, motivo })
});
```
**Esta requisição `PATCH` atualiza o status de um anúncio específico, aprovando-o ou rejeitando-o. O corpo da requisição inclui o novo status e, se aplicável, o motivo da rejeição.**


## 2. /private/editar-usuario/editar-conta.js

### 2.1 Obtenção dos dados dos usuários
```js
const response = await fetch('http://localhost:4000/api/dados-usuario', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
```
**Esta requisição `GET` busca os dados atuais do usuário para preencher o formulário de edição.**

### 2.2 Atualização da imagem de perfil
```js
const response = await fetch(`http://localhost:4000/api/adicionar-imagem`, {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
});
```
**Esta requisição `PATCH` envia uma nova imagem de perfil do usuário para o servidor.**

### 2.3 Atualização dos dados do usuário
```js
const response = await fetch('http://localhost:4000/api/editar-usuario', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(formData)
});
```
** Esta requisição `PATCH` envia os dados atualizados do usuário para o servidor. Todas as requisições utilizam autenticação via token JWT.**

## 3. /private/filtros/filtros-anuncios.js
```js
const response = await fetch(`http://localhost:4000/api/postagens?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
``` 
**Esta requisição `GET` busca as postagens filtradas com base nos parâmetros selecionados pelo usuário. Os parâmetros de filtro são adicionados à URL como query parameters. A requisição utiliza autenticação via token JWT.**

## 4. /private/meus-anuncios/meusanuncios.js

###  4.1 Criação de novo anúncio
```js
const response = await fetch('http://localhost:4000/api/criar-post', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});
```
**Esta requisição `POST` envia os dados de um novo anúncio para o servidor.**

### 4.2 Adição de imagens ao anúncio
```js
const response = await fetch(`http://localhost:4000/api/adicionar-imagem/${anuncioId}`, {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
});
```
**Esta requisição `PATCH` adiciona imagens a um anúncio específico.**

### 4.3 Carregamento dos anúncios
```js
const response = await fetch('http://localhost:4000/api/minhas-postagens', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
```
**Esta requisição `GET` busca todos os anúncios do usuário logado.**

### 4.4 Exclusão de um anúncio
```js
const response = await fetch(`http://localhost:4000/api/deletar-post/${anuncioId}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
});
```
**Esta requisição `DELETE` remove um anúncio específico do usuário.**

## 5. /private/logout.js
```js
localStorage.removeItem('Token');
```

Funcionalidade de logout do usuário, a linha remove o token de autenticação armazenado, encerrando a sessão do usuário. Em seguido, ele é redirecionado para a tela de login:
```js
window.location.href = '/login';
```

## 6. /public/definir-senha/definir-senha-inicial.js
```js
const response = await fetch(`http://localhost:4000/api/confirmar-email/${token}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ senha: password })
});
```
 
**Esta requisição `POST` é usada para confirmar o email do usuário e definir sua senha inicial. O token é extraído da URL e incluído na rota da API. O corpo da requisição contém a nova senha do usuário.**

## 7. /public/definir-senha/definir-senha-inicial.js/public/esqueceu-senha/esqueceu-senha.js
```js
const response = await fetch('https://sua-api.com/forgot-password', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
});
```
**Esta requisição `POST` é usada para iniciar o processo de recuperação de senha. O corpo da requisição contém o email do usuário que solicitou a redefinição de senha.**

## 8. /public/login/login.js
```js
const response = await fetch('http://localhost:4000/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, senha: password }) 
})
```
**Esta requisição `POST` é utilizada para autenticar o usuário. O corpo da requisição contém o email e a senha fornecidos pelo usuário. Após uma resposta bem-sucedida, o token JWT retornado é armazenado no localStorage:**
```js
localStorage.setItem('token', data.token)
```

## 9. /public/primeiroacesso/primeiroacesso.js
```js
const response = await fetch('http://localhost:4000/api/criar-usuario', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, nome, CPF: cpf }),
});
```
**Esta requisição `POST` é utilizada para criar um novo usuário no sistema. O corpo da requisição contém o email, nome e CPF fornecidos pelo usuário no formulário de primeiro acesso.**

## 4. Considerações Finais

O desenvolvimento do front-end para a plataforma de aluguel de repúblicas estudantis representa um passo legal na simplificação do processo de busca por moradia para estudantes. Através da implementação de tecnologias web modernas como JavaScript, HTML e CSS, conseguimos criar uma interface intuitiva e responsiva que atende às necessidades tanto dos estudantes quanto dos proprietários de imóveis.

A estrutura modular do projeto, com uma clara separação entre componentes públicos e privados, facilita a manutenção e escalabilidade futura do sistema. A integração com a API backend através de chamadas assíncronas permite uma experiência de usuário fluida e em tempo real.

Aspectos importantes como segurança (através do uso de tokens JWT) e usabilidade (com layouts responsivos e feedback visual) foram priorizados durante o desenvolvimento. A implementação de funcionalidades como filtros de busca, gerenciamento de anúncios e um sistema de aprovação demonstra o potencial da plataforma para resolver problemas reais no mercado de moradia estudantil.

À medida que o projeto evolui, há oportunidades para melhorias contínuas, como a implementação de testes automatizados, otimização de performance e adição de novas funcionalidades baseadas no feedback dos usuários. Este projeto estabelece uma base para uma solução que pode impactar a vida dos estudantes universitários, tornando a busca por moradia mais acessível e eficiente.
