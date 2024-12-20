const axios = require('axios'); // Biblioteca para fazer requisições HTTP

async function fetchOldestCSharpRepos() {
    const apiUrl = 'https://api.github.com/orgs/takenet/repos';

    try {
        // Faz a requisição para a API do GitHub
        const response = await axios.get(apiUrl, {
            params: {
                sort: 'created',    // Ordena pelos mais antigos
                direction: 'asc',   // Ordem ascendente
                per_page: 100       // Limita a 100 resultados
            },
            headers: {
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'GitHub-API-Request'
            }
        });

        // Filtra apenas os repositórios com linguagem C#
        const csharpRepos = response.data.filter(repo => repo.language === 'C#');

        // Pega os 5 mais antigos
        const oldestRepos = csharpRepos.slice(0, 5);

        // Exibe no console
        console.log('Os 5 repositórios de C# mais antigos da takenet:');
        oldestRepos.forEach(repo => {
            console.log(`- Nome: ${repo.full_name}`);
            console.log(`  Descrição: ${repo.description || 'Sem descrição'}`);
            console.log(`  URL: ${repo.html_url}`);
            console.log('-------------------------');
        });
    } catch (error) {
        console.error('Erro ao buscar os repositórios:', error.message);
    }
}

// Executa a função
fetchOldestCSharpRepos();
