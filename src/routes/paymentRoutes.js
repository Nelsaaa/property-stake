const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Route pour traiter le paiement
router.post('/pay', paymentController.handlePayment);

module.exports = router;
