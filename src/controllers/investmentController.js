const Investment = require('../models/Investment');
const Property = require('../models/Property');
const Wallet = require('../models/Wallet');
const Investor = require('../models/Investor')
const mongoose = require('mongoose');

const createInvestment = async (req, res) => {
    const { investorId, propertyId, shares, amountInvested } = req.body;

    try {
        // 1️⃣ Vérifier si la propriété existe et récupérer son montant financé
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Propriété non trouvée" });
        }

        if (property.status !== "funding") {
            return res.status(400).json({ message: "Cette propriété n'est plus ouverte au financement" });
        }

        // 2️⃣ Vérifier si l’investisseur a assez d’argent
        const wallet = await Wallet.findOne({ investor: investorId });
        if (!wallet || wallet.balance < amountInvested) {
            return res.status(400).json({ message: "Fonds insuffisants dans le wallet" });
        }

        // 3️⃣ Vérifier si le financement ne dépasse pas le prix total de la propriété
        const remainingAmount = property.price - property.amountFunded;
        if (amountInvested > remainingAmount) {
            return res.status(400).json({ message: `Financement excessif : Il reste seulement ${remainingAmount}€ à investir.` });
        }

        // 4️⃣ Mettre à jour la propriété de manière atomique
        const updatedProperty = await Property.findOneAndUpdate(
            { _id: propertyId, amountFunded: { $lt: property.price } }, // Vérifie que l'update est encore valide
            { 
                $inc: { amountFunded: amountInvested },
                $push: { investments: investorId }
            },
            { new: true }
        );

        if (!updatedProperty) {
            return res.status(400).json({ message: "Le financement de cette propriété est déjà complet." });
        }

        // 5️⃣ Débiter le wallet de l'investisseur
        wallet.balance -= amountInvested;
        wallet.transactions.push({ type: "investment", amount: amountInvested });
        await wallet.save();

        // 6️⃣ Ajouter l’investissement
        const newInvestment = new Investment({
            investor: investorId,
            property: propertyId,
            shares,
            amountInvested
        });

        await newInvestment.save();

        res.status(201).json({ message: "Investissement réussi", newInvestment });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
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
