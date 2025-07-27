const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const transactionRoutes = require('./routes/transactions');
//Importando 

dotenv.config(); // Carrega as variáveis do .env

const app = express(); // Criando o express
app.use(express.json()); // Permite que a API leia Json no corpo da requisição

app.use('/api/transactions', transactionRoutes); // Usa as rotas a partir do caminho /api/transactions  

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});




