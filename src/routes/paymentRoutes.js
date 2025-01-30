const express = require("express");
const router = express.Router();
const { processPayment } = require("../controllers/paymentController");
const { checkAgent } = require("../controllers/propertyController");
const checkAuth = require("../middleware/checkAuth");

// Route pour effectuer un paiement
router.post("/pay",checkAuth, processPayment);

module.exports = router;
