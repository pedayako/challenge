const express = require('express');
const axios = require('axios');

const router = express.Router();

// URL do avatar da Blip no GitHub
const BLIP_AVATAR_URL = 'https://avatars.githubusercontent.com/u/4369522?v=4';

// Endpoint para buscar os 5 repositórios mais antigos de linguagem C#
router.get('/repos', async (req, res) => {
    try {
        const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';
        const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'takenet';
        const LIMIT = 5;

        console.log(`Fazendo chamada para: ${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos`);

        // Chamada à API do GitHub
        const { data } = await axios.get(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos`, {
            params: { per_page: 100, sort: 'created', direction: 'asc' },
        });

        console.log('Dados recebidos da API do GitHub:');
        data.forEach(repo => {
            console.log(`Repositório: ${repo.full_name}, Linguagem: ${repo.language}`);
        });

        // Filtrar os repositórios de linguagem C#
        const filteredRepos = data.filter(repo => repo.language && repo.language.toLowerCase() === 'c#');
        console.log('Repositórios filtrados:', filteredRepos);

        if (filteredRepos.length === 0) {
            console.log('Nenhum repositório encontrado com a linguagem C#.');
            return res.status(404).json({ error: 'Nenhum repositório encontrado com a linguagem C#.' });
        }

        // Selecionar os 5 mais antigos e formatar para o carrossel
        const cards = filteredRepos.slice(0, LIMIT).map(repo => ({
            header: {
                type: 'image',
                value: BLIP_AVATAR_URL, // Avatar da Blip
            },
            title: repo.full_name, // Nome completo do repositório
            subtitle: repo.description || 'Sem descrição disponível', // Descrição do repositório
        }));

        console.log('Cards formatados para o carrossel:', cards);

        res.status(200).json({ items: cards });
    } catch (error) {
        console.error('Erro ao buscar repositórios:', error.message);
        res.status(500).json({ error: 'Erro ao processar a requisição.' });
    }
});

module.exports = router;
