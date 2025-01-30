const Property = require('../models/Property');  
const Agent = require('../models/Agent');

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

const checkFundingDeadlines = async () => {
  try {
    const now = new Date();
    
    // Trouver les propriétés en "funding" dont la date limite est dépassée
    const expiredProperties = await Property.find({
      status: 'funding',
      fundingDeadline: { $lt: now }
    }).populate('investments');

    for (const property of expiredProperties) {
      console.log(`Propriété expirée détectée: ${property.name}`);

      if (property.totalInvested < property.price) {
        await refundInvestors(property);
        property.status = 'closed';  // Fermer la propriété si elle n'est pas financée
      } else {
        property.status = 'funded';  // Si financée à 100%, elle devient "funded"
      }

      await property.save();
    }
  } catch (error) {
    console.error("Erreur lors de la vérification des délais de financement:", error);
  }
};

const refundInvestors = async (property) => {
  try {
    for (const investmentId of property.investments) {
      const investment = await Investment.findById(investmentId).populate('investor');

      if (!investment) continue;

      // Trouver le wallet de l'investisseur
      const wallet = await Wallet.findOne({ investor: investment.investor._id });

      if (wallet) {
        wallet.balance += investment.amountInvested;
        wallet.transactions.push({ type: 'refund', amount: investment.amountInvested });
        await wallet.save();
      }

      console.log(` Remboursement de ${investment.amountInvested}€ à ${investment.investor.email}`);

      // Supprimer l'investissement après remboursement
      await Investment.findByIdAndDelete(investmentId);
    }
  } catch (error) {
    console.error("Erreur lors du remboursement des investisseurs:", error);
  }
};

// Planifier l'exécution de `checkFundingDeadlines` toutes les 24 heures
setInterval(checkFundingDeadlines, 24 * 60 * 60 * 1000);


const checkAgent = async (req, res, next) => {
  try {
    
    const agentId = req.headers['x-agent-id'];  
    if (!agentId) {
      return res.status(401).json({ message: "Pas d'agent ID fourni" });
    }
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(403).json({ message: "Accès refusé, agent non trouvé" });
    }
    // Si OK
    next();
  } catch (error) {
    res.status(500).json({ message: "Erreur middleware agent", error });
  }
};

module.exports = { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty, getOpenProperties, createMultipleProperties, checkFundingDeadlines, refundInvestors,checkAgent};
