document.addEventListener('DOMContentLoaded', async () => {
    const anunciosContainer = document.getElementById('anuncios-container');

    try {
        // Obtendo os anúncios da API (substitua a URL pela sua API real)
        const response = await fetch('https://api.exemplo.com/meus-anuncios');
        const anuncios = await response.json();

        // Renderizando os anúncios
        anuncios.forEach(anuncio => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <div class="ad-info">
                    <img class="ad-image" src="${anuncio.imageUrl}" alt="Imagem do Anúncio">
                    <div class="ad-details">
                        <h2>${anuncio.title}</h2>
                        <p>${anuncio.description}</p>
                    </div>
                </div>
                <button class="delete-button" data-id="${anuncio.id}">
                    <img src="delete-icon.png" alt="Excluir">
                </button>
            `;

            anunciosContainer.appendChild(card);
        });

        // Adicionando funcionalidade ao botão de excluir
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
});

// Função para lidar com a exclusão de um anúncio
async function deleteAnuncio(anuncioId) {
    try {
        const response = await fetch(`https://api.exemplo.com/anuncios/${anuncioId}`, {
            method: 'DELETE',
            headers: {
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
document.addEventListener('DOMContentLoaded', async () => {
    const anunciosContainer = document.getElementById('anuncios-container');
    const modal = document.getElementById('modal');
    const btnAbrirModal = document.getElementById('btnAbrirModal');
    const spanFechar = document.querySelector('.close');

    // Abrir o modal ao clicar no botão
    btnAbrirModal.onclick = () => {
        modal.style.display = 'flex';
    }

    // Fechar o modal ao clicar no "x"
    spanFechar.onclick = () => {
        modal.style.display = 'none';
    }

    // Fechar o modal ao clicar fora dele
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    const publicarForm = document.getElementById('publicarForm');

    // Enviar o formulário
    publicarForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Coletar dados do formulário
        const formData = new FormData(publicarForm);

        try {
            // Enviar dados para a API
            const response = await fetch('https://api.exemplo.com/publicar-anuncio', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erro ao publicar o anúncio. Tente novamente.');
            }

            alert('Anúncio publicado com sucesso!');
            modal.style.display = 'none';
            // Recarregar anúncios após publicar um novo
            carregarAnuncios();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao publicar o anúncio. Tente novamente.');
        }
    });

    // Função para carregar anúncios
    async function carregarAnuncios() {
        try {
            // Obtendo os anúncios da API (substitua a URL pela sua API real)
            const response = await fetch('https://api.exemplo.com/meus-anuncios');
            const anuncios = await response.json();

            // Limpando o container para evitar duplicação
            anunciosContainer.innerHTML = '';

            // Renderizando os anúncios
            anuncios.forEach(anuncio => {
                const card = document.createElement('div');
                card.className = 'card';

                card.innerHTML = `
                    <div class="ad-info">
                        <img class="ad-image" src="${anuncio.imageUrl}" alt="Imagem do Anúncio">
                        <div class="ad-details">
                            <h2>${anuncio.title}</h2>
                            <p>${anuncio.description}</p>
                        </div>
                    </div>
                    <button class="delete-button" data-id="${anuncio.id}">
                        <img src="delete-icon.png" alt="Excluir">
                    </button>
                `;

                anunciosContainer.appendChild(card);
            });

            // Adicionando funcionalidade ao botão de excluir
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

    // Função para lidar com a exclusão de um anúncio
    async function deleteAnuncio(anuncioId) {
        try {
            const response = await fetch(`https://api.exemplo.com/anuncios/${anuncioId}`, {
                method: 'DELETE',
                headers: {
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

    // Carregar anúncios ao carregar a página
    carregarAnuncios();
});
