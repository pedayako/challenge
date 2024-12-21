require('dotenv').config(); // Carregar variáveis de ambiente
const express = require('express');
const routes = require('./routes'); // Importar o arquivo routes.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para aceitar JSON
app.use(express.json());

// Reutilizar a lógica do arquivo routes.js na rota base "/"
app.get('/', async (req, res) => {
    try {
        const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';
        const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'takenet';
        const LIMIT = 5;

        // Chamada à API do GitHub
        const { data } = await axios.get(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos`, {
            params: { per_page: 100, sort: 'created', direction: 'asc' },
        });

        // Filtrar os repositórios de linguagem C#
        const filteredRepos = data.filter(repo => repo.language && repo.language.toLowerCase() === 'c#');

        if (filteredRepos.length === 0) {
            return res.status(404).json({ error: 'Nenhum repositório encontrado com a linguagem C#.' });
        }

        // Selecionar os 5 mais antigos e formatar para o carrossel
        const cards = filteredRepos.slice(0, LIMIT).map(repo => ({
            header: {
                type: 'image',
                value: 'https://avatars.githubusercontent.com/u/4369522?v=4', // Avatar fixo do Blip
            },
            title: repo.full_name,
            subtitle: repo.description || 'Sem descrição disponível',
        }));

        res.status(200).json({ items: cards });
    } catch (error) {
        console.error('Erro ao buscar repositórios:', error.message);
        res.status(500).json({ error: 'Erro ao processar a requisição.' });
    }
});

// Também mantém a rota /github/repos como endpoint separado
app.use('/github', routes);

// Inicializar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
