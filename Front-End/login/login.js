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
      
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha: password }) 
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login')
      }
  
      // Armazena o token JWT no Local Storage
      localStorage.setItem('token', data.token)
  
      // Exibe mensagem de sucesso e redireciona para a página principal
      alert('Login realizado com sucesso!')
      window.location.href = '/dashboard' // Redireciona para a página protegida após o login
  
    } catch (error) {
      // Exibe a mensagem de erro
      errorMessage.textContent = error.message
      errorMessage.style.display = 'block'
    }
  })
  