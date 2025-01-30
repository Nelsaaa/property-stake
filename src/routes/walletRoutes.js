const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Créer un wallet
router.post('/', walletController.createWallet);

// Récupérer tous les wallets
router.get('/', walletController.getWallets);

// Récupérer un wallet par son ID
router.get('/:id', walletController.getWalletById);

// Mettre à jour un wallet
router.put('/:id', walletController.updateWallet);

// Supprimer un wallet
router.delete('/:id', walletController.deleteWallet);

router.put('/fund/:walletId', walletController.fundWallet);
router.put('/income/:walletId', walletController.receiveRentalIncome);

router.put('/:walletId/reinvest/:propertyId', walletController.reinvestRentalIncome);



module.exports = router;
