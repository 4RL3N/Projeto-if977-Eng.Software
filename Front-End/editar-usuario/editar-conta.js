document.addEventListener('DOMContentLoaded', () => {
    const editarContaForm = document.getElementById('editarContaForm');
    const profilePic = document.querySelector('.profile-pic');
    const uploadImage = document.getElementById('uploadImage');

    // Atualizar imagem de perfil
    profilePic.addEventListener('click', () => {
        uploadImage.click();
    });

    uploadImage.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePic.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Evento de envio do formulário
    editarContaForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Coletando dados do formulário
        const formData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            cpf: document.getElementById('cpf').value,
            contato: document.getElementById('contato').value,
            descricao: document.getElementById('descricao').value
        };

        try {
            // Enviando os dados para a API (substitua a URL pela sua API real)
            const response = await fetch('https://api.exemplo.com/editar-conta', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar os dados. Tente novamente mais tarde.');
            }

            alert('Dados atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar os dados:', error);
            alert('Erro ao atualizar os dados. Tente novamente.');
        }
    });
});
