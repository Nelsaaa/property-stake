// src/controllers/transactionController.js
const Transaction = require('../models/Transaction');

// Créer une transaction
const createTransaction = async (req, res) => {
  const { investorId, amount, type } = req.body;

  const newTransaction = new Transaction({
    investor: investorId,
    amount,
    type
  });

  try {
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction); // Réponse avec la transaction créée
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la transaction', error });
  }
};

// Lire toutes les transactions d'un investisseur
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions); // Réponse avec la liste des transactions
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des transactions', error });
  }
};

// Lire une transaction par son ID
const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }
    res.status(200).json(transaction); // Réponse avec la transaction trouvée
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération de la transaction', error });
  }
};

// Mettre à jour une transaction
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }
    res.status(200).json(updatedTransaction); // Réponse avec la transaction mise à jour
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la transaction', error });
  }
};

// Supprimer une transaction
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }
    res.status(200).json({ message: 'Transaction supprimée' }); // Réponse avec confirmation de la suppression
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de la transaction', error });
  }
};

module.exports = { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction };
