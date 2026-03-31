const express = require('express');
const app = express();

// Middleware para ler JSON
app.use(express.json());

// Rota de teste
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor da Biblioteca rodando!',
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
