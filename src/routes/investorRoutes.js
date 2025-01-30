// src/routes/investorRoutes.js
const express = require('express');
const router = express.Router();

// Importer le contrôleur d'investisseur
const investorController = require('../controllers/investorController');

// Créer un investisseur
router.post('/', investorController.createInvestor);

// Récupérer tous les investisseurs
router.get('/', investorController.getAllInvestors);

// Récupérer un investisseur par son ID
router.get('/:id', investorController.getInvestorById);

// Mettre à jour un investisseur
router.put('/:id', investorController.updateInvestor);

// Supprimer un investisseur
router.delete('/:id', investorController.deleteInvestor);

router.get('/:id/portfolio', investorController.getInvestorPortfolio);

router.post('/batch', investorController.createInvestorsBatch);


module.exports = router;
