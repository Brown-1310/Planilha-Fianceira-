const express = require('express');
const router = express.Router();  // Cria um roteador separado
const Transaction = require('../models/Transaction');

// GET - Listar todas as transações
router.get('/', async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

// POST - Criar uma nova transação
router.post('/', async (req, res) => {
  const { description, value, type } = req.body;

  // Validação básica
  if (!description || !value || !type) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  }

  // Cria e salva a transação no MongoDB
  const transaction = new Transaction({ description, value, type });
  await transaction.save();

  // Retorna a transação criada
  res.status(201).json(transaction);
});

module.exports = router; // Exporta o roteador
