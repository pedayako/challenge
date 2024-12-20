const express = require('express'); // Certifique-se de que o pacote Express está instalado
const axios = require('axios');    // Certifique-se de que o Axios está instalado

const app = express();
const port = process.env.PORT || 3000; // Porta dinâmica para suportar ambientes como Render

// Endpoint para buscar repositórios no GitHub
app.get('/github/repos', async (req, res) => {
  try {
    const GITHUB_API_URL = 'https://api.github.com'; // URL da API do GitHub
    const GITHUB_USERNAME = 'takenet';              // Nome do usuário do GitHub
    const LANGUAGE = 'C#';                          // Linguagem para filtrar
    const LIMIT = 5;                                // Limite de repositórios retornados

    console.log(`Buscando repositórios do GitHub para o usuário ${GITHUB_USERNAME}`);

    // Chamada para a API pública do GitHub
    const response = await axios.get(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos`, {
      params: {
        per_page: 100,
        sort: 'created',
        direction: 'asc',
      },
    });

    // Verificando os dados recebidos da API do GitHub
    console.log('Dados dos repositórios:', response.data);

    // Filtra os repositórios pela linguagem especificada
    const repositories = response.data
      .filter((repo) => repo.language === LANGUAGE)
      .slice(0, LIMIT);

    // Verifica se encontrou algum repositório após o filtro
    console.log('Repositórios filtrados:', repositories);

    // Monta os dados no formato esperado
    const carouselItems = repositories.map((repo) => ({
      title: repo.full_name,
      description: repo.description || 'Sem descrição disponível',
    }));

    // Envia a resposta ao cliente
    res.status(200).json({ items: carouselItems });
  } catch (error) {
    console.error('Erro ao buscar repositórios:', error.message);
    res.status(500).json({ error: 'Erro ao processar a requisição' });
  }
});

// Endpoint para chamar FastAPI
app.get('/fastapi/data', async (req, res) => {
  try {
    const FASTAPI_URL = 'http://localhost:8000/'; // URL da sua API FastAPI (substituir para produção, se necessário)

    // Exemplo de requisição GET para a FastAPI
    const fastApiResponse = await axios.get(`${FASTAPI_URL}some-endpoint`);  // Substitua 'some-endpoint' pelo endpoint correto da sua FastAPI

    // Envia a resposta ao cliente com os dados da FastAPI
    res.status(200).json(fastApiResponse.data);
  } catch (error) {
    console.error('Erro ao chamar a API FastAPI:', error.message);
    res.status(500).json({ error: 'Erro ao chamar a FastAPI' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na URL http://localhost:${port}/github/repos`);
});
