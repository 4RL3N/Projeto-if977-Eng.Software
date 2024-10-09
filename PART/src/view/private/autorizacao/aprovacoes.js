import { verificarAdmin } from "../verificarAdmin.js";

document.addEventListener('DOMContentLoaded', async () => {
    verificarAdmin();
    const postingsContainer = document.getElementById('postings-container');
    const rejectModal = document.getElementById('reject-modal');
    const rejectReasonInput = document.getElementById('reject-reason');
    const confirmRejectButton = document.getElementById('confirm-reject');
    const cancelRejectButton = document.getElementById('cancel-reject');

    const adDetailsModal = document.getElementById('ad-details-modal');
    const adDetailsCloseButton = adDetailsModal.querySelector('.close-button');
    const postImagesContainer = document.getElementById('post-images');
    const postDetailsContainer = document.getElementById('post-details');

    let currentPostId = null;

    try {
        // Obtendo as postagens da API
        const response = await fetch('https://part.fly.dev/api/postagens-admin', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar as postagens.');
        }

        const postings = await response.json();

        // Renderizando as postagens
        postings.forEach(posting => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <div class="ad-info">
                    <img class="ad-image" src="${posting.fotos[0]}" alt="Imagem do Anúncio">
                    <div class="ad-details">
                        <h2>${posting.titulo}</h2>
                        <p>${posting.desc}</p>
                        <p><strong>Contato:</strong> ${posting.cliente?.contato || 'Não disponível'}</p>
                    </div>
                </div>
                <div class="approve-buttons">
                    <button class="approve-button accept" data-id="${posting._id}">
                        <img src="../img/check.png" alt="Aprovar">
                    </button>
                    <button class="approve-button reject" data-id="${posting._id}">
                        <img src="../img/Vector.png" alt="Rejeitar">
                    </button>
                </div>
            `;

            postingsContainer.appendChild(card);

            // Evento para abrir detalhes do anúncio
            const adInfoDiv = card.querySelector('.ad-info');
            adInfoDiv.addEventListener('click', () => {
                openAdDetailsModal(posting);
            });
        });

        // Adicionando funcionalidade aos botões de aprovação e rejeição
        document.querySelectorAll('.approve-button.accept').forEach(button => {
            button.addEventListener('click', async (event) => {
                const postId = event.currentTarget.dataset.id;
                await handleApproval(postId, true);
            });
        });

        document.querySelectorAll('.approve-button.reject').forEach(button => {
            button.addEventListener('click', (event) => {
                currentPostId = event.currentTarget.dataset.id;
                openRejectModal();
            });
        });

    } catch (error) {
        console.error('Erro ao carregar as postagens:', error);
        postingsContainer.innerHTML = '<p>Erro ao carregar as postagens. Tente novamente mais tarde.</p>';
    }

    // Função para abrir o modal de rejeição
    function openRejectModal() {
        rejectModal.classList.remove('hidden');
    }

    // Função para fechar o modal de rejeição
    function closeRejectModal() {
        rejectModal.classList.add('hidden');
        rejectReasonInput.value = ''; // Limpar o motivo quando fechar o modal
        currentPostId = null;
    }

    // Confirmar rejeição
    confirmRejectButton.addEventListener('click', async () => {
        const motivo = rejectReasonInput.value.trim();
        if (motivo) {
            await handleApproval(currentPostId, false, motivo);
            closeRejectModal();
        } else {
            alert('Por favor, insira um motivo para a rejeição.');
        }
    });

    // Cancelar rejeição
    cancelRejectButton.addEventListener('click', () => {
        closeRejectModal();
    });

    // Função para lidar com a aprovação ou rejeição de um anúncio
    async function handleApproval(postId, isApproved, motivo = '') {
        try {
            const url = isApproved
                ? `https://part.fly.dev/api/aprovar-post/${postId}`
                : `https://part.fly.dev/api/desaprovar-post/${postId}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ autorizada: isApproved, motivo })
            });

            if (response.ok) {
                alert(isApproved ? 'Anúncio aprovado!' : 'Anúncio rejeitado!');
                document.querySelector(`[data-id="${postId}"]`).closest('.card').remove();
            } else {
                throw new Error('Erro ao atualizar o status do anúncio.');
            }
        } catch (error) {
            console.error('Erro ao atualizar o status do anúncio:', error);
            alert('Erro ao atualizar o status do anúncio. Tente novamente.');
        }
    }

    // Funções para o modal de detalhes do anúncio
    function openAdDetailsModal(posting) {
        // Limpar conteúdo anterior
        postImagesContainer.innerHTML = '';
        postDetailsContainer.innerHTML = '';
    
        // Adicionar imagens
        if (posting.fotos && posting.fotos.length > 0) {
            posting.fotos.forEach(foto => {
                const img = document.createElement('img');
                img.src = foto;
                postImagesContainer.appendChild(img);
            });
        } else {
            const noImage = document.createElement('p');
            noImage.textContent = 'Sem imagens disponíveis.';
            postImagesContainer.appendChild(noImage);
        }
    
        // Formatar datas
        const criadoEm = new Date(posting.criadoEm).toLocaleDateString('pt-BR');
        const atualizadoEm = new Date(posting.atualizadoEm).toLocaleDateString('pt-BR');
    
        // Adicionar detalhes
        const detailsHTML = `
            <h2>${posting.titulo}</h2>
            <p><strong>Descrição:</strong> ${posting.desc || 'Não informada'}</p>
            <p><strong>Valor:</strong> R$ ${posting.valor || 'Não informado'}</p>
            <p><strong>Cidade:</strong> ${posting.cidade || 'Não informada'}</p>
            <p><strong>Bairro:</strong> ${posting.bairro || 'Não informado'}</p>
            <p><strong>Rua:</strong> ${posting.rua || 'Não informada'}, ${posting.numero || ''}</p>
            <p><strong>Universidade:</strong> ${posting.universidade || 'Não informada'}</p>
            <p><strong>Acomodação:</strong> ${posting.acomodacao || ''} - ${posting.tipo_acomodacao || ''}</p>
            <p><strong>Criado em:</strong> ${criadoEm}</p>
            <p><strong>Atualizado em:</strong> ${atualizadoEm}</p>
            <p><strong>Contato:</strong> ${posting.cliente?.contato || 'Não disponível'}</p>
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
