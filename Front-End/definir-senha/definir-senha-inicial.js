document.getElementById('passwordForm').addEventListener('submit', async function(event) {
    event.preventDefault()

    const passwordInput = document.getElementById('password')
    const confirmPasswordInput = document.getElementById('confirmPassword')
    const errorMessage = document.getElementById('error-message')
    const password = passwordInput.value.trim()
    const confirmPassword = confirmPasswordInput.value.trim()

    // Limpa mensagens anteriores
    errorMessage.style.display = 'none'
    errorMessage.textContent = ''

    // Validação de senha
    if (password.length < 8) {
        errorMessage.textContent = 'A senha deve ter pelo menos 8 caracteres.'
        errorMessage.style.display = 'block'
        return
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = 'As senhas não coincidem.'
        errorMessage.style.display = 'block'
        return
    }

    try {
        // Chamada para a API
        const response = await fetch('https://sua-api-url.com/definir-senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        })

        if (!response.ok) {
            throw new Error('Erro ao criar a senha. Tente novamente mais tarde.')
        }

        // Sucesso - redireciona ou exibe uma mensagem de sucesso
        alert('Senha criada com sucesso!')

    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
    }
})
