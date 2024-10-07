document.addEventListener('DOMContentLoaded', async () => {
    const postingsContainer = document.getElementById('postings-container');

    try {
        // Obtendo as postagens da API (substitua a URL pela sua API real)
        const response = await fetch('https://api.exemplo.com/anuncios-pendentes');
        const postings = await response.json();

        // Renderizando as postagens
        postings.forEach(posting => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <div class="ad-info">
                    <img class="ad-image" src="${posting.imageUrl}" alt="Imagem do Anúncio">
                    <div class="ad-details">
                        <h2>${posting.title}</h2>
                        <p>${posting.description}</p>
                    </div>
                </div>
                <div class="approve-buttons">
                    <button class="approve-button accept" data-id="${posting.id}">
                        <img src="check-icon.png" alt="Aprovar">
                    </button>
                    <button class="approve-button reject" data-id="${posting.id}">
                        <img src="reject-icon.png" alt="Rejeitar">
                    </button>
                </div>
            `;

            postingsContainer.appendChild(card);
        });

        // Adicionando funcionalidade aos botões de aprovação e rejeição
        document.querySelectorAll('.approve-button.accept').forEach(button => {
            button.addEventListener('click', async (event) => {
                const postId = event.currentTarget.dataset.id;
                await handleApproval(postId, true);
            });
        });

        document.querySelectorAll('.approve-button.reject').forEach(button => {
            button.addEventListener('click', async (event) => {
                const postId = event.currentTarget.dataset.id;
                await handleApproval(postId, false);
            });
        });

    } catch (error) {
        console.error('Erro ao carregar as postagens:', error);
        postingsContainer.innerHTML = '<p>Erro ao carregar as postagens. Tente novamente mais tarde.</p>';
    }
});

// Função para lidar com a aprovação ou rejeição de um anúncio
async function handleApproval(postId, isApproved) {
    try {
        const response = await fetch(`https://api.exemplo.com/anuncios/${postId}/aprovar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ approved: isApproved })
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
