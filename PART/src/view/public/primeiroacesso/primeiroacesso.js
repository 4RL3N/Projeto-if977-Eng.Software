document.getElementById('accessForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Limpa mensagem de erro
    errorMessage.style.display = 'none';

    // Validação básica do email
    if (!validateEmail(email)) {
        errorMessage.textContent = 'Por favor, insira um email válido.';
        errorMessage.style.display = 'block';
        return;
    }

    // Validação básica do CPF
    if (!validateCPF(cpf)) {
        errorMessage.textContent = 'Por favor, insira um CPF válido.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        // Chamada para a API (substitua 'API_URL' pela URL real)
        const response = await fetch('http://localhost:4000/api/criar-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, nome, CPF: cpf }),
        });
        

        if (response.ok) {
            alert('Usuário criado com sucesso! Verifique seu email para confirmar a conta.');
        } else {
            const errorData = await response.json();
            errorMessage.textContent = errorData.error || 'Ocorreu um erro ao enviar os dados.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Erro de rede ou servidor. Tente novamente mais tarde.';
        errorMessage.style.display = 'block';
    }
});

// Função simples para validar email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função simples para validar CPF (adapte conforme necessário)
function validateCPF(cpf) {
    const regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    return regex.test(cpf);
}
