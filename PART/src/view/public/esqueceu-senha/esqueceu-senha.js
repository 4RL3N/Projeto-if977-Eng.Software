document.getElementById('forgot-password-form').addEventListener('submit', async function(event) {
    event.preventDefault()

    const email = document.getElementById('email').value
    const errorMessage = document.getElementById('error-message')

    // Limpa a mensagem de erro anterior
    errorMessage.style.display = 'none'

    // Validação simples
    if (!email) {
        errorMessage.textContent = 'Por favor, insira seu email.'
        errorMessage.style.display = 'block'
        return
    }

    try {
        // Exemplo de chamada para a API de recuperação de senha (substitua com sua API real)
        const response = await fetch('https://sua-api.com/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao enviar a recuperação de senha')
        }

        alert('Email de recuperação enviado com sucesso!')
        // Você pode redirecionar para outra página ou limpar o formulário
        // document.getElementById('forgot-password-form').reset()

    } catch (error) {
        // Exibe a mensagem de erro
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
    }
})
