// src/controllers/investmentController.js
const Investment = require('../models/Investment');

// Créer un investissement
const createInvestment = async (req, res) => {
  const { investorId, propertyId, shares, amountInvested } = req.body;

  const newInvestment = new Investment({
    investor: investorId,
    property: propertyId,
    shares,
    amountInvested
  });

  try {
    const savedInvestment = await newInvestment.save();
    res.status(201).json(savedInvestment); // Réponse avec l'investissement créé
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de l\'investissement', error });
  }
};

// Lire tous les investissements d'un investisseur
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find().populate('property');
    res.status(200).json(investments); // Réponse avec la liste des investissements
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des investissements', error });
  }
};

// Lire un investissement par son ID
const getInvestmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const investment = await Investment.findById(id).populate('property');
    if (!investment) {
      return res.status(404).json({ message: 'Investissement non trouvé' });
    }
    res.status(200).json(investment); // Réponse avec l'investissement trouvé
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération de l\'investissement', error });
  }
};

// Mettre à jour un investissement
const updateInvestment = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedInvestment = await Investment.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedInvestment) {
      return res.status(404).json({ message: 'Investissement non trouvé' });
    }
    res.status(200).json(updatedInvestment); // Réponse avec l'investissement mis à jour
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'investissement', error });
  }
};

// Supprimer un investissement
const deleteInvestment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInvestment = await Investment.findByIdAndDelete(id);
    if (!deletedInvestment) {
      return res.status(404).json({ message: 'Investissement non trouvé' });
    }
    res.status(200).json({ message: 'Investissement supprimé' }); // Réponse avec confirmation de la suppression
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de l\'investissement', error });
  }
};

module.exports = { createInvestment, getInvestments, getInvestmentById, updateInvestment, deleteInvestment };
