document.addEventListener('DOMContentLoaded', async () => {
    const editarContaForm = document.getElementById('editarContaForm');
    const profilePic = document.querySelector('.profile-pic');
    const uploadImage = document.getElementById('uploadImage');

    // Caminho da imagem padrão
    const imagemPadrao = '../img/AddImage.png';

    // Função para preencher o formulário com os dados do usuário
    const preencherFormulario = (usuario) => {
        document.getElementById('nome').value = usuario.nome || '';
        document.getElementById('email').value = usuario.email || '';
        document.getElementById('cpf').value = usuario.CPF || '';
        document.getElementById('contato').value = usuario.contato || '';
        document.getElementById('descricao').value = usuario.desc || '';

        // Se o usuário tiver uma foto, exibe a foto, senão, exibe a imagem padrão
        if (usuario.foto && usuario.foto.length > 0) {
            profilePic.src = usuario.foto[0]; 
        } else {
            profilePic.src = imagemPadrao;
        }
    };

    // Faz a requisição para a API para buscar os dados do usuário
    try {
        const response = await fetch('http://localhost:4000/api/dados-usuario', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar os dados do usuário.');
        }

        const usuario = await response.json();
        preencherFormulario(usuario);
    } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error);
        alert('Erro ao carregar os dados do usuário. Tente novamente mais tarde.');
    }

    // Atualizar imagem de perfil
    profilePic.addEventListener('click', () => {
        uploadImage.click();
    });

    uploadImage.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Atualiza a imagem localmente
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePic.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Cria o FormData para enviar a imagem
            const formData = new FormData();
            formData.append('fotos', file);

            try {
                const response = await fetch(`http://localhost:4000/api/adicionar-imagem`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Erro ao enviar imagem. Tente novamente.');
                }


                alert('Imagem atualizada com sucesso!');
            } catch (error) {
                console.error('Erro ao enviar imagem:', error);
                alert('Erro ao enviar imagem. Tente novamente.');
            }
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
            // Enviando os dados para a API
            const response = await fetch('http://localhost:4000/api/editar-usuario', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
