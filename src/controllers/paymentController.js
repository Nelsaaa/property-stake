const paymentService = require('../services/paymentService');

const handlePayment = async (req, res) => {
  const { amount, token } = req.body;
  try {
    const charge = await paymentService.processPayment(amount, token);
    res.status(200).json(charge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handlePayment };
