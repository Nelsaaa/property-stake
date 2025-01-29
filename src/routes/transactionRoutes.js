// src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Créer une transaction
router.post('/', transactionController.createTransaction);

// Récupérer toutes les transactions
router.get('/', transactionController.getTransactions);

// Récupérer une transaction par son ID
router.get('/:id', transactionController.getTransactionById);

// Mettre à jour une transaction
router.put('/:id', transactionController.updateTransaction);

// Supprimer une transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
