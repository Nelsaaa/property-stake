const express = require('express');
const router = express.Router();
const rentalIncomeController = require('../controllers/rentalIncomeController');

// Route pour distribuer les revenus locatifs d'une propriété
router.post('/:propertyId/distribute-rental-income', rentalIncomeController.distributeRentalIncome);

module.exports = router;
