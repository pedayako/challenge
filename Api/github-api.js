require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const express = require('express');
const routes = require('./routes'); // Importar o arquivo routes.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Mensagem de boas-vindas para a rota raiz "/"
app.get('/', (req, res) => {
    res.send('Bem-vindo à API! Use localhost:3000/github/repos para acessar os dados.');
});

// Usar as rotas definidas no arquivo routes.js
app.use('/github', routes);

// Inicializar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
