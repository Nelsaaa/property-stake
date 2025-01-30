const Property = require('../models/Property');  

// Créer une propriété
const createProperty = async (req, res) => {
  const { name, description, price, type, fundingDeadline } = req.body;

  const newProperty = new Property({
    name,
    description,
    price,
    type,
    status: 'funding',  // Statut par défaut
    fundingDeadline,
  });

  try {
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty); // Retourne la propriété créée
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
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }

    // On vérifie si le statut est déjà "funded" ou "sold"
    if (property.status === 'funded' || property.status === 'sold') {
      return res.status(400).json({ message: 'Impossible de modifier une propriété déjà financée ou vendue.' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(updatedProperty); // Retourne la propriété mise à jour
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la propriété', error });
  }
};


// Supprimer une propriété
const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }

    if (property.status === 'funded' || property.status === 'sold') {
      return res.status(400).json({ message: 'Impossible de supprimer une propriété déjà financée ou vendue.' });
    }

    const deletedProperty = await Property.findByIdAndDelete(id);
    res.status(200).json({ message: 'Propriété supprimée' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de la propriété', error });
  }
};


// Dans le contrôleur des propriétés
const getOpenProperties = async (req, res) => {
  try {
    // Trouver toutes les propriétés avec le statut 'funding' et limite à 6 propriétés
    const properties = await Property.find({ status: 'funding' }).limit(6);
    res.status(200).json(properties); // Réponse avec la liste des propriétés
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des propriétés ouvertes', error });
  }
};
// Créer plusieurs propriétés en une seule requête
const createMultipleProperties = async (req, res) => {
  try {
    const properties = await Property.insertMany(req.body);
    res.status(201).json(properties);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création des propriétés', error });
  }
};


module.exports = { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty, getOpenProperties, createMultipleProperties};
