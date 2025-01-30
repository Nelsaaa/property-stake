const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const checkAuth = require('../middleware/checkAuth');

// Créer un wallet
router.post('/',checkAuth, walletController.createWallet);

// Récupérer tous les wallets
router.get('/', walletController.getWallets);

// Récupérer un wallet par son ID
router.get('/:id', walletController.getWalletById);

// Mettre à jour un wallet
router.put('/:id',checkAuth, walletController.updateWallet);

// Supprimer un wallet
router.delete('/:id', checkAuth, walletController.deleteWallet);

router.put('/fund/:walletId',checkAuth, walletController.fundWallet);
router.put('/income/:walletId',checkAuth, walletController.receiveRentalIncome);

router.put('/:walletId/reinvest/:propertyId',checkAuth, walletController.reinvestRentalIncome);



module.exports = router;
