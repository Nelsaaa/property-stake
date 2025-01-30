const jwt = require('jsonwebtoken');
const Investor = require('../models/Investor');

async function checkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization; // ex: "Bearer <token>"
    if (!authHeader) {
      return res.status(401).json({ message: "Pas de token fourni" });
    }
    const token = authHeader.split(" ")[1];
    // Décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Récupérer l'investisseur
    const investor = await Investor.findById(decoded.investorId);
    if (!investor) {
      return res.status(401).json({ message: "Investisseur introuvable" });
    }
    // Stocker l'investisseur dans req
    req.investor = investor;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide", error });
  }
}

module.exports = checkAuth;