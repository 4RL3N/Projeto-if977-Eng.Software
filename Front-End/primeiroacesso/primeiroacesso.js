document.getElementById('accessForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const errorMessage = document.getElementById('error-message');
    const email = emailInput.value.trim();

    // Limpa mensagem de erro
    errorMessage.style.display = 'none';

    // Validação básica do email
    if (!validateEmail(email)) {
        errorMessage.textContent = 'Por favor, insira um email válido.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        // Chamada para a API (substitua 'API_URL' pela URL real)
        const response = await fetch('API_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            alert('Email enviado com sucesso!');
            // Redirecionar ou tomar alguma ação após o sucesso
        } else {
            // Trata erros de resposta da API
            const errorData = await response.json();
            errorMessage.textContent = errorData.message || 'Ocorreu um erro ao enviar o email.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        // Trata erros de rede ou outros erros inesperados
        errorMessage.textContent = 'Erro de rede ou servidor. Tente novamente mais tarde.';
        errorMessage.style.display = 'block';
    }
});

// Função simples para validar email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}