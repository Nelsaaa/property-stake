// controllers/paymentController.js
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Wallet = require('../models/Wallet');
const { sendEmail } = require('../services/emailService');

const processPayment = async (req, res) => {
  const { walletId, amount, token, email } = req.body;

  try {
    // Vérifier le wallet
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet non trouvé' });
    }

    // Créer la charge Stripe
    const charge = await stripe.charges.create({
      amount: amount * 100, // en centimes
      currency: 'eur',
      source: token,
      description: `Alimentation du Wallet ${walletId}`,
    });

    // Mettre à jour le wallet
    wallet.balance += amount;
    wallet.transactions.push({ type: 'fund', amount });
    await wallet.save();

    // **Envoyer le reçu par email** (Mailtrap)
    await sendEmail(
      email,               // le destinataire (payer)
      'Votre reçu - PropertyStake', // objet
      `Bonjour,\n\nNous confirmons votre paiement de ${amount} EUR. Merci de votre confiance!\n\nCordialement,\nPropertyStake` 
    );

    res.status(200).json({
      message: 'Paiement réussi, reçu envoyé',
      charge,
      wallet
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de paiement', error: error.message });
  }
};

module.exports = { processPayment };
