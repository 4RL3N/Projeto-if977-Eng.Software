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
        // Captura o token do URL
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (!token) {
            throw new Error('Token inválido ou não encontrado.')
        }

        // Chamada para a API
        const response = await fetch(`http://localhost:4000/api/confirmar-email/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ senha: password })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao criar a senha. Tente novamente mais tarde.')
        }

        // Sucesso - redireciona ou exibe uma mensagem de sucesso
        alert('Senha criada com sucesso!')
        window.location.href = '/login' 

    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
    }
})
