const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ importa o CORS
const transactionRoutes = require('./routes/transactions');

dotenv.config(); // Carrega as variáveis do .env

const app = express();

// Aplica CORS para permitir requisições do navegador
app.use(cors());

// Middleware para ler JSON no corpo das requisições
app.use(express.json());

// Rota para transações
app.use('/api/transactions', transactionRoutes);

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});






