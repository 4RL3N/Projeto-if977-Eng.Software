document.addEventListener('DOMContentLoaded', () => {
    const filtroForm = document.getElementById('filtroForm');

    filtroForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Coletando dados do formulário
        const formData = {
            acomodacao: document.querySelector('input[name="acomodacao"]:checked')?.value,
            tipoAcomodacao: document.querySelector('input[name="tipoAcomodacao"]:checked')?.value,
            universidade: document.getElementById('universidade').value,
            cidade: document.getElementById('cidade').value,
            preco: document.getElementById('preco').value,
            bairro: document.getElementById('bairro').value
        };

        try {
            // Enviando os dados para a API (substitua a URL pela sua API real)
            const response = await fetch('https://api.exemplo.com/filtros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erro ao aplicar os filtros. Tente novamente mais tarde.');
            }

            // Aqui você pode manipular a resposta da API, como redirecionar ou mostrar os resultados na mesma página
            alert('Filtros aplicados com sucesso!');

        } catch (error) {
            console.error('Erro ao aplicar os filtros:', error);
            alert('Erro ao aplicar os filtros. Tente novamente.');
        }
    });
});
