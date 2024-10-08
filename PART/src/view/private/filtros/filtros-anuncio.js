import { verificarAdmin } from "../verificarAdmin.js";

document.addEventListener('DOMContentLoaded', async () => {
    verificarAdmin();
    const filtroForm = document.getElementById('filtroForm');

    filtroForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Coletando dados do formulário
        const acomodacao = document.querySelector('input[name="acomodacao"]:checked')?.value;
        const tipoAcomodacao = document.querySelector('input[name="tipoAcomodacao"]:checked')?.value;
        const universidade = document.getElementById('universidade').value;
        const cidade = document.getElementById('cidade').value;
        const preco = document.getElementById('preco').value;
        const bairro = document.getElementById('bairro').value;

        // Montando os parâmetros de consulta (query parameters)
        const queryParams = new URLSearchParams();
        if (acomodacao) queryParams.append('acomodacao', acomodacao);
        if (tipoAcomodacao) queryParams.append('tipo_acomodacao', tipoAcomodacao);
        if (universidade) queryParams.append('universidade', universidade);
        if (cidade) queryParams.append('cidade', cidade);
        if (bairro) queryParams.append('bairro', bairro);
        if (preco) queryParams.append('preco', preco);

        try {
            // Enviando os dados para a API
            const response = await fetch(`http://localhost:4000/api/postagens?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 404) {
                exibirMensagem('Nenhuma postagem encontrada com os filtros aplicados.');
                return;
            }

            if (!response.ok) {
                throw new Error('Erro ao aplicar os filtros. Tente novamente mais tarde.');
            }

            const postagens = await response.json();
            
            // Manipular a resposta da API (exibir as postagens filtradas)
            exibirPostagens(postagens);

        } catch (error) {
            console.error('Erro ao aplicar os filtros:', error);
            alert('Erro ao aplicar os filtros. Tente novamente.');
        }
    });

    // Função para exibir as postagens
    function exibirPostagens(postagens) {
        const resultadosContainer = document.getElementById('resultados');
        resultadosContainer.innerHTML = ''; 
    
        postagens.forEach(postagem => {
            const card = document.createElement('div');
            card.className = 'postagem-card';
            card.innerHTML = `
                <div class="postagem-card-container">
                    <img src="${postagem.fotos[0]}" alt="Imagem da Acomodação" class="postagem-foto">
                    <div class="postagem-conteudo">
                        <h2>${postagem.titulo}</h2>
                        <div class="postagem-tags">
                            <span class="tag">${postagem.universidade}</span>
                            <span class="tag">${postagem.acomodacao}</span>
                            <span class="tag">${postagem.tipo_acomodacao}</span>
                        </div>
                        <p>${postagem.desc}</p>
                    </div>
                </div>
            `;
            resultadosContainer.appendChild(card);
        });
    }

    // Função para exibir mensagem de erro ou aviso
    function exibirMensagem(mensagem) {
        const resultadosContainer = document.getElementById('resultados');
        resultadosContainer.innerHTML = `<p class="mensagem">${mensagem}</p>`;
    }
});
