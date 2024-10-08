document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();

            // Limpa o token de autenticação ou outros dados relacionados à sessão do localStorage ou cookies
            localStorage.removeItem('token'); 

            // Redireciona para a página de login
            window.location.href = '/login';
        });
    }
});
