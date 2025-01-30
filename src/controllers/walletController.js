const Wallet = require('../models/Wallet');
const Investor = require('../models/Investor');

// Créer un wallet pour un investisseur
const createWallet = async (req, res) => {
  const { investorId } = req.body;
  
  try {
    const investor = await Investor.findById(investorId);
    if (!investor) {
      return res.status(404).json({ message: "Investisseur non trouvé" });
    }

    const existingWallet = await Wallet.findOne({ investor: investorId });
    if (existingWallet) {
      return res.status(400).json({ message: "L'investisseur a déjà un wallet" });
    }

    const newWallet = new Wallet({ investor: investorId });
    const savedWallet = await newWallet.save();
    res.status(201).json(savedWallet);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création du wallet", error });
  }
};

// Provisionner de l'argent dans le wallet
const fundWallet = async (req, res) => {
    try {
      const { walletId } = req.params;
      const { amount } = req.body;
  
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Montant invalide' });
      }
  
      const wallet = await Wallet.findById(walletId);
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet non trouvé' });
      }
  
      wallet.balance += amount;
      wallet.transactions.push({ type: 'fund', amount });
  
      await wallet.save();
      res.status(200).json({ message: 'Fonds ajoutés avec succès', wallet });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error });
    }
  };
  
  const receiveRentalIncome = async (req, res) => {
    try {
      const { walletId } = req.params;
      const { amount } = req.body;
  
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Montant invalide' });
      }
  
      const wallet = await Wallet.findById(walletId);
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet non trouvé' });
      }
  
      wallet.balance += amount;
      wallet.transactions.push({ type: 'rental_income', amount });
  
      await wallet.save();
      res.status(200).json({ message: 'Revenus locatifs ajoutés avec succès', wallet });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error });
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

module.exports = { createWallet, fundWallet, receiveRentalIncome, getWallets, getWalletById, updateWallet, deleteWallet };
