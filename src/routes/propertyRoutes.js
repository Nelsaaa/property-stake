const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

// Créer une propriété
router.post('/', propertyController.createProperty);

// Récupérer toutes les propriétés
router.get('/', propertyController.getProperties);

// Récupérer les propriétés ouvertes pour financement 
router.get('/open-for-funding', propertyController.getOpenProperties);

// Récupérer une propriété par son ID
router.get('/:id', propertyController.getPropertyById);

// Mettre à jour une propriété
router.put('/:id', propertyController.updateProperty);

// Supprimer une propriété
router.delete('/:id', propertyController.deleteProperty);

// Créer plusieurs propriétés en une seule requête
router.post('/batch', propertyController.createMultipleProperties);



module.exports = router;
