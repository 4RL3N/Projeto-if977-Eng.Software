
export async function verificarAdmin() {
    const aprovacoesAba = document.getElementById('aprovacoes-aba');
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const response = await fetch('http://localhost:4000/api/dados-usuario', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const usuario = await response.json();
                if (usuario.categoria === 'Admin') {
                    aprovacoesAba.style.display = 'block';
                }
            } else {
                console.error('Erro ao buscar dados do usuário:', response.status);
            }
        } catch (error) {
            console.error('Erro ao verificar cargo do usuário:', error);
        }
    }
}
