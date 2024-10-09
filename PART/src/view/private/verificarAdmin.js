export async function verificarAdmin() {
    const aprovacoesAba = document.getElementById('aprovacoes-aba');
    const token = localStorage.getItem('token');

    if (!token) {
        // Se não houver token, redireciona para a página de login
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch('https://part.fly.dev/api/dados-usuario', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const usuario = await response.json();
            if (usuario.categoria === 'Admin') {
                // Se o usuário for admin, exibe a aba de aprovações
                aprovacoesAba.style.display = 'block';
            }
        } else if (response.status === 401 || response.status === 403) {
            // Token inválido ou expirado, redireciona para a página de login
            localStorage.removeItem('token');
            window.location.href = '/';
        } else {
            console.error('Erro ao buscar dados do usuário:', response.status);
            // Opcionalmente, redirecionar para a página de login em outros casos de erro
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Erro ao verificar cargo do usuário:', error);
        // Em caso de erro, redireciona para a página de login
        localStorage.removeItem('token');
        window.location.href = '/';
    }
}
