const express = require('express'); // Certifique-se de que o pacote Express está instalado
const axios = require('axios');    // Certifique-se de que o Axios está instalado

const app = express();
const port = 3000;

// Teste básico para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  console.log('Recebendo requisição para o endpoint /');
  res.send('Servidor funcionando!');
});

// Endpoint para buscar repositórios no GitHub
app.get('/github/repos', async (req, res) => {
  try {
    const GITHUB_API_URL = 'https://api.github.com'; // URL da API do GitHub
    const GITHUB_USERNAME = 'takenet';              // Nome do usuário do GitHub
    const LANGUAGE = 'C#';                          // Linguagem para filtrar
    const LIMIT = 5;                                // Limite de repositórios retornados

    // Chamada para a API pública do GitHub
    const response = await axios.get(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos`, {
      params: {
        per_page: 100,
        sort: 'created',
        direction: 'asc',
      },
    });

    // Filtra os repositórios pela linguagem especificada
    const repositories = response.data
      .filter((repo) => repo.language === LANGUAGE)
      .slice(0, LIMIT);

    // Monta os dados no formato esperado sem imagem
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
    const FASTAPI_URL = 'http://localhost:8000/'; // URL da sua API FastAPI (supondo que ela esteja rodando na porta 8000)

    // Exemplo de requisição GET para a FastAPI
    const fastApiResponse = await axios.get(`${FASTAPI_URL}some-endpoint`);  // Substitua 'some-endpoint' pelo endpoint correto da sua FastAPI

    // Envia a resposta ao cliente com os dados da FastAPI
    res.status(200).json(fastApiResponse.data);
  } catch (error) {
    console.error('Erro ao chamar a API FastAPI:', error.message);
    res.status(500).json({ error: 'Erro ao chamar a FastAPI' });
  }
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}. Acesse em: http://localhost:${port}/`);
});
