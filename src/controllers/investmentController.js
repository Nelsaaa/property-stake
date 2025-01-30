const Investment = require('../models/Investment');
const Property = require('../models/Property');
const Wallet = require('../models/Wallet');

// créer un investissement
const createInvestment = async (req, res) => {
  const { investorId, propertyId, shares, amountInvested } = req.body;

  try {
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Propriété non trouvée" });

    if (property.status !== 'funding') {
      return res.status(400).json({ message: "Cette propriété n'est plus ouverte au financement" });
    }

    const newInvestment = new Investment({
      investor: investorId,
      property: propertyId,
      shares,
      amountInvested
    });

    const savedInvestment = await newInvestment.save();

    // Mettre à jour le totalInvested de la propriété
    property.totalInvested += amountInvested;
    property.investments.push(savedInvestment._id);

    //  Vérifier si la propriété est entièrement financée
    if (property.totalInvested >= property.price) {
      property.status = 'funded'; // Changer le statut en "funded"
    }

    await property.save();

    res.status(201).json(savedInvestment);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de l'investissement", error });
  }
};

//  Lire tous les investissements d'un investisseur
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find().populate('property');
    res.status(200).json(investments);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la récupération des investissements", error });
  }
};

// Lire un investissement par son ID
const getInvestmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const investment = await Investment.findById(id).populate('property');
    if (!investment) {
      return res.status(404).json({ message: "Investissement non trouvé" });
    }
    res.status(200).json(investment);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la récupération de l'investissement", error });
  }
};

//  Mettre à jour un investissement
const updateInvestment = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedInvestment = await Investment.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedInvestment) {
      return res.status(404).json({ message: "Investissement non trouvé" });
    }
    res.status(200).json(updatedInvestment);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour de l'investissement", error });
  }
};

// Supprimer un investissement (avec remboursement)
const deleteInvestment = async (req, res) => {
  const { id } = req.params;

  try {
    const investment = await Investment.findById(id);
    if (!investment) {
      return res.status(404).json({ message: "Investissement non trouvé" });
    }

    //  Remboursement à l'investisseur
    const wallet = await Wallet.findOne({ investor: investment.investor });
    if (wallet) {
      wallet.balance += investment.amountInvested;
      wallet.transactions.push({ type: "refund", amount: investment.amountInvested });
      await wallet.save();
    }

    // Mettre à jour la propriété
    const property = await Property.findById(investment.property);
    if (property) {
      property.totalInvested -= investment.amountInvested;
      property.investments = property.investments.filter(inv => inv.toString() !== id);
      if (property.status === "funded") {
        property.status = "funding"; // Remettre en "funding" si on annule un investissement
      }
      await property.save();
    }

    await Investment.findByIdAndDelete(id);
    res.status(200).json({ message: "Investissement supprimé et remboursé" });
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la suppression de l'investissement", error });
  }
};

module.exports = { createInvestment, getInvestments, getInvestmentById, updateInvestment, deleteInvestment };
