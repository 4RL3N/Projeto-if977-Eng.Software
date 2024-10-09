document.getElementById('accessForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const errorMessage = document.getElementById('error-message');
    const submitButton = event.target.querySelector('button[type="submit"]');

    // Limpa mensagem de erro
    errorMessage.style.display = 'none';

    // Bloqueia o botão para evitar múltiplos envios
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    // Validação básica do email
    if (!validateEmail(email)) {
        errorMessage.textContent = 'Por favor, insira um email válido.';
        errorMessage.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar';
        return;
    }

    // Validação básica do CPF
    if (!validateCPF(cpf)) {
        errorMessage.textContent = 'Por favor, insira um CPF válido.';
        errorMessage.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar';
        return;
    }

    try {
        const response = await fetch('https://part.fly.dev/api/criar-usuario', {
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
    } finally {
        // Habilita o botão novamente e restaura o texto original
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar';
    }
});

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateCPF(cpf) {
    const regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    return regex.test(cpf);
}
