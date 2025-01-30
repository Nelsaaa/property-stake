const Agent = require('../models/Agent');
const Property = require('../models/Property');

// Créer un Agent (inscription)
const createAgent = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Vérifier si l'email existe déjà
    const existing = await Agent.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Un agent avec cet email existe déjà" });
    }

    const newAgent = new Agent({ fullName, email, password });
    await newAgent.save();

    res.status(201).json({ message: "Agent créé avec succès", agent: newAgent });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'agent", error });
  }
};

// Connexion d'un Agent (login)
const loginAgent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(404).json({ message: "Agent introuvable" });
    }
    // Vérifier mot de passe (en clair ou hashé selon ton code)
    if (agent.password !== password) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }
    // Générer un token ou un mécanisme de session
    res.status(200).json({ message: "Connexion réussie", agent });
  } catch (error) {
    res.status(500).json({ message: "Erreur de connexion agent", error });
  }
};


const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des agents", error });
  }
};

module.exports = { createAgent, loginAgent, getAllAgents };
