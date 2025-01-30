const express = require("express");
const router = express.Router();
const { processPayment } = require("../controllers/paymentController");

// Route pour effectuer un paiement
router.post("/pay", processPayment);

module.exports = router;
