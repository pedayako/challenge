require('dotenv').config(); // Carregar variáveis de ambiente
const express = require('express');
const routes = require('./routes'); // Importar as rotas

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para aceitar JSON
app.use(express.json());

// Rota raiz ("/") reutilizando a rota de "/github/repos"
app.use('/', routes);

// Inicializar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});