const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Fonction pour traiter un paiement
const processPayment = async (amount, token) => {
  try {
    // Créer la charge
    const charge = await stripe.charges.create({
      amount: amount * 100, // Amount in cents (Stripe travaille en centimes)
      currency: 'eur',
      source: token,
    });
    return charge;
  } catch (error) {
    throw new Error('Erreur lors du paiement : ' + error.message);
  }
};

module.exports = { processPayment };
