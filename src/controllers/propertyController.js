const Property = require('../models/Property');  // Assurez-vous que le modèle Property est défini dans `models/Property.js`

// Créer une propriété
const createProperty = async (req, res) => {
  const { name, location, price } = req.body; // Dépend de votre modèle

  const newProperty = new Property({
    name,
    location,
    price
  });

  try {
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty); // Réponse avec la propriété créée
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la propriété', error });
  }
};

// Lire toutes les propriétés
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties); // Réponse avec la liste des propriétés
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des propriétés', error });
  }
};

// Lire une propriété par son ID
const getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.status(200).json(property); // Réponse avec la propriété trouvée
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération de la propriété', error });
  }
};

// Mettre à jour une propriété
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.status(200).json(updatedProperty); // Réponse avec la propriété mise à jour
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la propriété', error });
  }
};

// Supprimer une propriété
const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.status(200).json({ message: 'Propriété supprimée' }); // Réponse avec confirmation de la suppression
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de la propriété', error });
  }
};

module.exports = { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty };
