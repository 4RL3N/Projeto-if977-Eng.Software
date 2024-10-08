import { verificarAdmin } from "../verificarAdmin.js";

document.addEventListener('DOMContentLoaded', async () => {
    verificarAdmin();
    const filtroForm = document.getElementById('filtroForm');
    const resultadosContainer = document.getElementById('resultados');

    // Elementos do modal
    const adDetailsModal = document.getElementById('ad-details-modal');
    const adDetailsCloseButton = adDetailsModal.querySelector('.close-button');
    const postImagesContainer = document.getElementById('post-images');
    const postDetailsContainer = document.getElementById('post-details');

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

            // Exibir as postagens filtradas
            exibirPostagens(postagens);

        } catch (error) {
            console.error('Erro ao aplicar os filtros:', error);
            alert('Erro ao aplicar os filtros. Tente novamente.');
        }
    });

    // Função para exibir as postagens
    function exibirPostagens(postagens) {
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
            // Adiciona o evento de clique para abrir o modal
            card.addEventListener('click', () => {
                openAdDetailsModal(postagem);
            });
            resultadosContainer.appendChild(card);
        });
    }

    // Função para exibir mensagem de erro ou aviso
    function exibirMensagem(mensagem) {
        resultadosContainer.innerHTML = `<p class="mensagem">${mensagem}</p>`;
    }

    // Funções para o modal de detalhes do anúncio
    function openAdDetailsModal(postagem) {
        // Limpar conteúdo anterior
        postImagesContainer.innerHTML = '';
        postDetailsContainer.innerHTML = '';

        // Adicionar imagens
        if (postagem.fotos && postagem.fotos.length > 0) {
            postagem.fotos.forEach(foto => {
                const img = document.createElement('img');
                img.src = foto;
                img.alt = 'Foto do anúncio';
                postImagesContainer.appendChild(img);
            });
        } else {
            const noImage = document.createElement('p');
            noImage.textContent = 'Sem imagens disponíveis.';
            postImagesContainer.appendChild(noImage);
        }

        // Formatar datas
        const criadoEm = postagem.criadoEm ? new Date(postagem.criadoEm).toLocaleDateString('pt-BR') : 'Não informado';
        const atualizadoEm = postagem.atualizadoEm ? new Date(postagem.atualizadoEm).toLocaleDateString('pt-BR') : 'Não informado';

        // Adicionar detalhes
        const detailsHTML = `
            <h2>${postagem.titulo || 'Título não informado'}</h2>
            <p><strong>Descrição:</strong> ${postagem.desc || 'Não informada'}</p>
            <p><strong>Valor:</strong> R$ ${postagem.valor || 'Não informado'}</p>
            <p><strong>Cidade:</strong> ${postagem.cidade || 'Não informada'}</p>
            <p><strong>Bairro:</strong> ${postagem.bairro || 'Não informado'}</p>
            <p><strong>Endereço:</strong> ${postagem.rua || 'Não informada'}, ${postagem.numero || ''}</p>
            <p><strong>Universidade:</strong> ${postagem.universidade || 'Não informada'}</p>
            <p><strong>Acomodação:</strong> ${postagem.acomodacao || ''} - ${postagem.tipo_acomodacao || ''}</p>
            <p><strong>Criado em:</strong> ${criadoEm}</p>
            <p><strong>Atualizado em:</strong> ${atualizadoEm}</p>
            <p><strong>Contato:</strong> ${postagem.cliente?.contato || 'Não disponível'}</p>
        `;
        postDetailsContainer.innerHTML = detailsHTML;

        // Exibir o modal
        adDetailsModal.classList.remove('hidden');
    }

    function closeAdDetailsModal() {
        adDetailsModal.classList.add('hidden');
    }

    // Evento para fechar o modal de detalhes
    adDetailsCloseButton.addEventListener('click', closeAdDetailsModal);

    // Fechar o modal ao clicar fora do conteúdo
    window.addEventListener('click', (event) => {
        if (event.target == adDetailsModal) {
            closeAdDetailsModal();
        }
    });
});
