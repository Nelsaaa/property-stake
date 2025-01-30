const Wallet = require('../models/Wallet');
const Property = require('../models/Property');
const Investment = require('../models/Investment');

const distributeRentalIncome = async (req, res) => {
    try {
        const { propertyId } = req.params;
        let { amount } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Montant invalide, veuillez fournir un nombre valide." });
        }

        amount = parseFloat(amount);

        // Récupérer la propriété et s'assurer qu'on peuple bien les investissements
        const property = await Property.findById(propertyId).populate({
            path: 'investments',
            populate: { path: 'investor' }
        });

        if (!property) {
            return res.status(404).json({ message: "Propriété non trouvée" });
        }

        console.log(`🔍 Propriété trouvée : ${property.name}, Nombre d'investissements: ${property.investments.length}`);

        if (!property.investments || property.investments.length === 0) {
            return res.status(400).json({ message: "Aucun investisseur trouvé pour cette propriété" });
        }

        // Vérification et calcul du total des shares
        let totalShares = 0;
        property.investments.forEach(investment => {
            if (investment.shares && !isNaN(investment.shares)) {
                totalShares += investment.shares;
            } else {
                console.log(`⚠️ Problème avec investment.shares :`, investment);
            }
        });

        console.log(`📊 Total des actions (shares) : ${totalShares}`);

        if (totalShares <= 0 || isNaN(totalShares)) {
            return res.status(400).json({ message: "Erreur : Le total des actions des investisseurs est invalide. Vérifiez vos investissements." });
        }

        // Distribution des revenus locatifs aux investisseurs
        for (let investment of property.investments) {
            const wallet = await Wallet.findOne({ investor: investment.investor._id });

            if (wallet) {
                const investorShare = (investment.shares / totalShares) * amount;

                console.log(`💰 Investor ${investment.investor._id} reçoit ${investorShare}€ (${investment.shares} actions)`);

                if (isNaN(investorShare) || investorShare <= 0) {
                    return res.status(400).json({ message: "Erreur de calcul des parts des investisseurs." });
                }

                wallet.balance += investorShare;
                wallet.transactions.push({ type: 'rental_income', amount: investorShare });

                await wallet.save();
            } else {
                console.log(`⚠️ Wallet non trouvé pour l'investisseur ${investment.investor._id}`);
            }
        }

        res.status(200).json({ message: "Revenus locatifs distribués avec succès à tous les investisseurs" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

module.exports = { distributeRentalIncome };
