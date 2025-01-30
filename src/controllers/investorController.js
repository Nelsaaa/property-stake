// src/controllers/investorController.js
const Investor = require('../models/Investor');
const Investment = require('../models/Investment')

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

const getInvestorPortfolio = async (req, res) => {
    const { id } = req.params; // Récupérer l'ID de l'investisseur depuis l'URL
  
    try {
      // Vérifier si l'investisseur existe
      const investor = await Investor.findById(id);
      if (!investor) {
        return res.status(404).json({ message: 'Investisseur non trouvé' });
      }
  
      // Récupérer les investissements de l'investisseur
      const investments = await Investment.find({ investor: id }).populate('property');
  
      // Retourner la liste des investissements avec les propriétés associées
      res.status(200).json(investments);
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la récupération du portfolio', error });
    }
  };

  const createInvestorsBatch = async (req, res) => {
    try {
      const investors = await Investor.insertMany(req.body);
      res.status(201).json(investors);
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la création des investisseurs', error });
    }
  };

  const getInvestorInvestments = async (req, res) => {
    const { id } = req.params; // Récupérer l'ID de l'investisseur

    try {
        // Vérifier si l'investisseur existe
        const investor = await Investor.findById(id);
        if (!investor) {
            return res.status(404).json({ message: "Investisseur non trouvé" });
        }

        // Récupérer les investissements de cet investisseur avec les détails des propriétés
        const investments = await Investment.find({ investor: id }).populate('property');

        // Retourner les investissements trouvés
        res.status(200).json(investments);
    } catch (error) {
        console.error("Erreur lors de la récupération des investissements :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des investissements", error });
    }
};

  
  

module.exports = { createInvestor, getAllInvestors, getInvestorById, updateInvestor, deleteInvestor,getInvestorPortfolio, createInvestorsBatch, getInvestorInvestments };
