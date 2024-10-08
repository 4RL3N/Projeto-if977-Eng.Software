document.addEventListener('DOMContentLoaded', async () => {
    const anunciosContainer = document.getElementById('anuncios-container');
    const modal = document.getElementById('modal');
    const btnAbrirModal = document.getElementById('btnAbrirModal');
    const spanFechar = document.querySelector('.close');
    const publicarForm = document.getElementById('publicarForm');
    const fotosInput = document.getElementById('fotos'); // Input de imagem

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

    carregarAnuncios();
});
