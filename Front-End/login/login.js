document.getElementById('login-form').addEventListener('submit', async function(event) {
  event.preventDefault()
  
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const errorMessage = document.getElementById('error-message')

  // Limpa a mensagem de erro anterior
  errorMessage.style.display = 'none'

  // Validação simples
  if (!email || !password) {
      errorMessage.textContent = 'Por favor, preencha todos os campos.'
      errorMessage.style.display = 'block'
      return
  }

  try {
      // Exemplo de chamada para a API (substitua com sua API real)
      const response = await fetch('https://sua-api.com/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
          throw new Error(data.message || 'Erro ao fazer login')
      }

      // Redireciona para a página principal ou exibe sucesso
      alert('Login realizado com sucesso!')
      // window.location.href = '/dashboard' // Exemplo de redirecionamento

  } catch (error) {
      // Exibe a mensagem de erro
      errorMessage.textContent = error.message
      errorMessage.style.display = 'block'
  }
})
