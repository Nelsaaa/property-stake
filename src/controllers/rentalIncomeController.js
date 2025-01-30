const Property = require('../models/Property');
const Investment = require('../models/Investment');
const Wallet = require('../models/Wallet');

// Distribuer les revenus locatifs mensuels
const distributeRentalIncome = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Vérifier si la propriété existe et que le certificat de propriété est délivré
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Propriété non trouvée." });
    }

    if (!property.ownershipCertificateDelivered) {
      return res.status(400).json({ message: "Le certificat de propriété n'a pas encore été délivré." });
    }

    // Vérifier qu'il y a un revenu locatif défini pour cette propriété
    if (!property.rentalIncome || property.rentalIncome <= 0) {
      return res.status(400).json({ message: "Aucun revenu locatif défini pour cette propriété." });
    }

    // Récupérer tous les investissements dans cette propriété
    const investments = await Investment.find({ property: propertyId }).populate('investor');

    if (investments.length === 0) {
      return res.status(400).json({ message: "Aucun investisseur pour cette propriété." });
    }

    // Distribuer le revenu à chaque investisseur en fonction de ses parts
    for (let investment of investments) {
      const investorWallet = await Wallet.findOne({ investor: investment.investor._id });
      if (!investorWallet) continue;

      const investorIncome = (investment.shares / 100) * property.rentalIncome;

      investorWallet.balance += investorIncome;
      investorWallet.transactions.push({ type: 'rental_income', amount: investorIncome });
      await investorWallet.save();
    }

    res.status(200).json({ message: "Revenus locatifs distribués avec succès." });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

module.exports = { distributeRentalIncome };
