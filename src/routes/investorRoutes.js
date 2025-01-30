// src/routes/investorRoutes.js
const express = require('express');
const router = express.Router();



// Importer le contrôleur d'investisseur
const investorController = require('../controllers/investorController');
const checkAuth = require('../middleware/checkAuth');

// Inscription
router.post('/register', investorController.registerInvestor);
// Connexion
router.post('/login', investorController.loginInvestor);

// Créer un investisseur
router.post('/', investorController.createInvestor);

// Récupérer tous les investisseurs
router.get('/', investorController.getAllInvestors);

// Récupérer un investisseur par son ID
router.get('/:id', investorController.getInvestorById);

// Mettre à jour un investisseur
router.put('/:id',checkAuth, investorController.updateInvestor);

// Supprimer un investisseur
router.delete('/:id', investorController.deleteInvestor);

router.get('/:id/portfolio', checkAuth, investorController.getInvestorPortfolio);

router.post('/batch', investorController.createInvestorsBatch);

router.get('/:id/investments', investorController.getInvestorInvestments);



module.exports = router;
