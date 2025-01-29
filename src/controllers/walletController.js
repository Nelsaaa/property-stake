const Wallet = require('../models/Wallet');

// Créer un wallet
const createWallet = async (req, res) => {
  const newWallet = new Wallet(req.body);
  try {
    const savedWallet = await newWallet.save();
    res.status(201).json(savedWallet); // Réponse avec le wallet créé
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du wallet', error });
  }
};

// Récupérer tous les wallets
const getWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find();
    res.status(200).json(wallets); // Réponse avec la liste des wallets
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des wallets', error });
  }
};

// Récupérer un wallet par son ID
const getWalletById = async (req, res) => {
  const { id } = req.params;
  try {
    const wallet = await Wallet.findById(id);
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet non trouvé' });
    }
    res.status(200).json(wallet); // Réponse avec le wallet trouvé
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération du wallet', error });
  }
};

// Mettre à jour un wallet
const updateWallet = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedWallet = await Wallet.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedWallet) {
      return res.status(404).json({ message: 'Wallet non trouvé' });
    }
    res.status(200).json(updatedWallet); // Réponse avec le wallet mis à jour
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du wallet', error });
  }
};

// Supprimer un wallet
const deleteWallet = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedWallet = await Wallet.findByIdAndDelete(id);
    if (!deletedWallet) {
      return res.status(404).json({ message: 'Wallet non trouvé' });
    }
    res.status(200).json({ message: 'Wallet supprimé' }); // Réponse avec confirmation de la suppression
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression du wallet', error });
  }
};

module.exports = { createWallet, getWallets, getWalletById, updateWallet, deleteWallet };
