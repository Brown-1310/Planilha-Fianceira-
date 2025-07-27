const mongoose = require('mongoose');
// Importa o mongoose

// Define o esquema da transação (campos e tipos)
const transactionSchema = new mongoose.Schema({
  description: {   // Descrição da transação
    type: String,
    required: true
  },
  value: {        // Valor da transação
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'], // entrada ou saída
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Exporta o modelo "Transaction" baseado no schema
module.exports = mongoose.model('Transaction', transactionSchema);
