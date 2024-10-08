document.addEventListener('DOMContentLoaded', () => {
    const filtroForm = document.getElementById('filtroForm');

    filtroForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Coletando dados do formulário
        const acomodacao = document.querySelector('input[name="acomodacao"]:checked')?.value;
        const tipoAcomodacao = document.querySelector('input[name="tipoAcomodacao"]:checked')?.value;
        const universidade = document.getElementById('universidade').value;
        const cidade = document.getElementById('cidade').value;
        const preco = document.getElementById('preco').value;
        const bairro = document.getElementById('bairro').value;

        // Montando os parâmetros de consulta (query parameters)
        const queryParams = new URLSearchParams();
        if (acomodacao) queryParams.append('acomodacao', acomodacao);
        if (tipoAcomodacao) queryParams.append('tipo_acomodacao', tipoAcomodacao);
        if (universidade) queryParams.append('universidade', universidade);
        if (cidade) queryParams.append('cidade', cidade);
        if (bairro) queryParams.append('bairro', bairro);
        if (preco) queryParams.append('preco', preco);

        try {
            // Enviando os dados para a API
            const response = await fetch(`http://localhost:4000/api/postagens?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao aplicar os filtros. Tente novamente mais tarde.');
            }

            const postagens = await response.json();
            
            // Manipular a resposta da API (exibir as postagens filtradas)
            exibirPostagens(postagens);

        } catch (error) {
            console.error('Erro ao aplicar os filtros:', error);
            alert('Erro ao aplicar os filtros. Tente novamente.');
        }
    });

    // Função para exibir as postagens
    function exibirPostagens(postagens) {
        const resultadosContainer = document.getElementById('resultados');
        resultadosContainer.innerHTML = ''; // Limpa resultados anteriores

        postagens.forEach(postagem => {
            const card = document.createElement('div');
            card.className = 'postagem-card';
            card.innerHTML = `
                <h2>${postagem.titulo}</h2>
                <p>${postagem.desc}</p>
                <p><strong>Cidade:</strong> ${postagem.cidade}</p>
                <p><strong>Bairro:</strong> ${postagem.bairro}</p>
                <p><strong>Contato:</strong> ${postagem.cliente.contato}</p>
            `;
            resultadosContainer.appendChild(card);
        });
    }
});
