import { verificarAdmin } from "../verificarAdmin.js";

document.addEventListener('DOMContentLoaded', async () => {
    verificarAdmin();
    const anunciosContainer = document.getElementById('anuncios-container');
    const modal = document.getElementById('modal');
    const btnAbrirModal = document.getElementById('btnAbrirModal');
    const spanFechar = document.querySelector('.close');
    const publicarForm = document.getElementById('publicarForm');
    const fotosInput = document.getElementById('fotos'); // Input de imagem

    // Elementos do modal de detalhes do anúncio
    const adDetailsModal = document.getElementById('ad-details-modal');
    const adDetailsCloseButton = adDetailsModal.querySelector('.close-button');
    const postImagesContainer = document.getElementById('post-images');
    const postDetailsContainer = document.getElementById('post-details');

    // Abrir o modal ao clicar no botão
    btnAbrirModal.onclick = () => {
        modal.style.display = 'flex';
    };

    // Fechar o modal ao clicar no "x"
    spanFechar.onclick = () => {
        modal.style.display = 'none';
    };

    // Fechar o modal ao clicar fora dele
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Enviar o formulário
    publicarForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        // Coletar dados do formulário
        const data = {
            titulo: document.getElementById('titulo').value, 
            desc: document.getElementById('descricao').value,
            valor: parseFloat(document.getElementById('valor').value.replace(',', '.')), // Converter valor para número
            cidade: document.getElementById('cidade').value,
            universidade: document.getElementById('universidade').value,
            bairro: document.getElementById('bairro').value,
            acomodacao: document.getElementById('acomodacao').value, // Deve ser 'Quarto' ou 'Casa'
            tipo_acomodacao: document.getElementById('tipoAcomodacao').value, // Deve ser 'Individual' ou 'Compartilhado'
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value
        };
    
        try {
            const response = await fetch('http://localhost:4000/api/criar-post', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao publicar o anúncio. Tente novamente.');
            }
    
            const novoAnuncio = await response.json();
            alert('Anúncio publicado com sucesso!');
    
            // Verifica se há imagens para adicionar
            if (fotosInput.files.length > 0) {
                await adicionarImagem(novoAnuncio._id, fotosInput.files);
            }
    
            modal.style.display = 'none';
            carregarAnuncios();
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    });

    // Função para adicionar imagem
    async function adicionarImagem(anuncioId, files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('fotos', files[i]);
        }

        try {
            const response = await fetch(`http://localhost:4000/api/adicionar-imagem/${anuncioId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar imagem. Tente novamente.');
            }

            alert('Imagem adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar imagem:', error);
            alert('Erro ao adicionar imagem. Tente novamente.');
        }
    }

    // Função para carregar anúncios
    async function carregarAnuncios() {
        try {
            const response = await fetch('http://localhost:4000/api/minhas-postagens', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const anuncios = await response.json();
            anunciosContainer.innerHTML = '';

            anuncios.forEach(anuncio => {
                const card = document.createElement('div');
                card.className = 'card';

                card.innerHTML = `
                    <div class="ad-info">
                        <img class="ad-image" src="${anuncio.fotos[0] || '../img/Edit.png'}" alt="Imagem do Anúncio">
                        <div class="ad-details">
                            <h2>${anuncio.titulo}</h2>
                            <p>${anuncio.desc}</p>
                        </div>
                    </div>
                    <button class="delete-button" data-id="${anuncio._id}">
                        <img src="../img/Vector.png" alt="Excluir">
                    </button>
                `;

                anunciosContainer.appendChild(card);

                // Evento para abrir o modal de detalhes ao clicar no anúncio
                const adInfoDiv = card.querySelector('.ad-info');
                adInfoDiv.style.cursor = 'pointer'; // Mudar o cursor para indicar que é clicável
                adInfoDiv.addEventListener('click', () => {
                    openAdDetailsModal(anuncio);
                });
            });

            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const anuncioId = event.currentTarget.dataset.id;
                    await deleteAnuncio(anuncioId);
                });
            });

        } catch (error) {
            console.error('Erro ao carregar os anúncios:', error);
            anunciosContainer.innerHTML = '<p>Erro ao carregar os anúncios. Tente novamente mais tarde.</p>';
        }
    }

    async function deleteAnuncio(anuncioId) {
        try {
            const response = await fetch(`http://localhost:4000/api/deletar-post/${anuncioId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Anúncio excluído com sucesso!');
                document.querySelector(`[data-id="${anuncioId}"]`).closest('.card').remove();
            } else {
                throw new Error('Erro ao excluir o anúncio.');
            }
        } catch (error) {
            console.error('Erro ao excluir o anúncio:', error);
            alert('Erro ao excluir o anúncio. Tente novamente.');
        }
    }

    // Funções para o modal de detalhes do anúncio
    function openAdDetailsModal(anuncio) {
        // Limpar conteúdo anterior
        postImagesContainer.innerHTML = '';
        postDetailsContainer.innerHTML = '';

        // Adicionar imagens
        if (anuncio.fotos && anuncio.fotos.length > 0) {
            anuncio.fotos.forEach(foto => {
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
        const criadoEm = anuncio.criadoEm ? new Date(anuncio.criadoEm).toLocaleDateString('pt-BR') : 'Não informado';
        const atualizadoEm = anuncio.atualizadoEm ? new Date(anuncio.atualizadoEm).toLocaleDateString('pt-BR') : 'Não informado';

        // Adicionar detalhes
        const detailsHTML = `
            <h2>${anuncio.titulo || 'Título não informado'}</h2>
            <p><strong>Descrição:</strong> ${anuncio.desc || 'Não informada'}</p>
            <p><strong>Valor:</strong> R$ ${anuncio.valor || 'Não informado'}</p>
            <p><strong>Cidade:</strong> ${anuncio.cidade || 'Não informada'}</p>
            <p><strong>Bairro:</strong> ${anuncio.bairro || 'Não informado'}</p>
            <p><strong>Endereço:</strong> ${anuncio.rua || 'Não informada'}, ${anuncio.numero || ''}</p>
            <p><strong>Universidade:</strong> ${anuncio.universidade || 'Não informada'}</p>
            <p><strong>Acomodação:</strong> ${anuncio.acomodacao || ''} - ${anuncio.tipo_acomodacao || ''}</p>
            <p><strong>Criado em:</strong> ${criadoEm}</p>
            <p><strong>Atualizado em:</strong> ${atualizadoEm}</p>
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

    carregarAnuncios();
});
