document.addEventListener('DOMContentLoaded', async () => {
    const anunciosContainer = document.getElementById('anuncios-container');
    const modal = document.getElementById('modal');
    const btnAbrirModal = document.getElementById('btnAbrirModal');
    const spanFechar = document.querySelector('.close');
    const fotosInput = document.getElementById('fotos'); // Campo de imagem

    btnAbrirModal.onclick = () => {
        modal.style.display = 'flex';
    };

    spanFechar.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    const publicarForm = document.getElementById('publicarForm');

    publicarForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(publicarForm);

        try {
            const response = await fetch('http://localhost:4000/api/criar-post', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erro ao publicar o anúncio. Tente novamente.');
            }

            const novoAnuncio = await response.json();
            alert('Anúncio publicado com sucesso!');

            if (fotosInput.files.length > 0) {
                await adicionarImagem(novoAnuncio._id, fotosInput.files);
            }

            modal.style.display = 'none';
            carregarAnuncios();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao publicar o anúncio. Tente novamente.');
        }
    });

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
                        <img class="ad-image" src="${anuncio.fotos[0] || 'default-image.png'}" alt="Imagem do Anúncio">
                        <div class="ad-details">
                            <h2>${anuncio.titulo}</h2>
                            <p>${anuncio.desc}</p>
                        </div>
                    </div>
                    <button class="delete-button" data-id="${anuncio._id}">
                        <img src="delete-icon.png" alt="Excluir">
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
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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

    async function adicionarImagem(postId, files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('fotos', files[i]);
        }

        try {
            const response = await fetch(`http://localhost:4000/api/adicionar-imagem/${postId}`, {
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

    carregarAnuncios();
});
