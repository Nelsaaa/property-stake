// src/routes/investmentRoutes.js
const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const checkAuth = require('../middleware/checkAuth');

// Créer un investissement
router.post('/',checkAuth, investmentController.createInvestment);

// Récupérer tous les investissements
router.get('/', investmentController.getInvestments);

// Récupérer un investissement par son ID
router.get('/:id', investmentController.getInvestmentById);

// Mettre à jour un investissement
router.put('/:id',checkAuth, investmentController.updateInvestment);

// Supprimer un investissement
router.delete('/:id', checkAuth, investmentController.deleteInvestment);



module.exports = router;

