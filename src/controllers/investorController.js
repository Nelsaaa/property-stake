// src/controllers/investorController.js
const Investor = require('../models/Investor');

// Créer un investisseur
const createInvestor = async (req, res) => {
  const { name, email, walletId } = req.body;

  const newInvestor = new Investor({
    name,
    email,
    wallet: walletId
  });

  try {
    const savedInvestor = await newInvestor.save();
    res.status(201).json(savedInvestor); // Réponse avec l'investisseur créé
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de l\'investisseur', error });
  }
};

// Lire tous les investisseurs
const getAllInvestors = async (req, res) => {
  try {
    const investors = await Investor.find().populate('wallet');
    res.status(200).json(investors); // Réponse avec la liste des investisseurs
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des investisseurs', error });
  }
};

// Lire un investisseur par son ID
const getInvestorById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const investor = await Investor.findById(id).populate('wallet');
    if (!investor) {
      return res.status(404).json({ message: 'Investisseur non trouvé' });
    }
    res.status(200).json(investor); // Réponse avec l'investisseur trouvé
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération de l\'investisseur', error });
  }
};

// Mettre à jour un investisseur
const updateInvestor = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedInvestor = await Investor.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedInvestor) {
      return res.status(404).json({ message: 'Investisseur non trouvé' });
    }
    res.status(200).json(updatedInvestor); // Réponse avec l'investisseur mis à jour
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'investisseur', error });
  }
};

// Supprimer un investisseur
const deleteInvestor = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInvestor = await Investor.findByIdAndDelete(id);
    if (!deletedInvestor) {
      return res.status(404).json({ message: 'Investisseur non trouvé' });
    }
    res.status(200).json({ message: 'Investisseur supprimé' }); // Réponse avec confirmation de la suppression
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de l\'investisseur', error });
  }
};

module.exports = { createInvestor, getAllInvestors, getInvestorById, updateInvestor, deleteInvestor };
