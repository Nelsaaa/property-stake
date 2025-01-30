// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


// Import des routes
const investorRoutes = require('./routes/investorRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const walletRoutes = require('./routes/walletRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const emailRoutes = require('./routes/emailRoutes');
const investorProfileRoutes = require('./routes/investorProfileRoutes');
const rentalIncomeRoutes = require('./routes/rentalIncomeRoutes');


const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

const helmet = require('helmet');

// Utiliser Helmet pour améliorer la sécurité
app.use(helmet());

// Configuration spécifique de la CSP pour permettre le favicon
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'http://localhost:5001'],  // Permet de charger le favicon à partir de localhost
    // Ajoutez d'autres directives selon les besoins
  },
}));


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.log('Erreur de connexion MongoDB:', err));

// Utilisation des routes
app.use('/investors', investorRoutes);
app.use('/investments', investmentRoutes);
app.use('/transactions', transactionRoutes);
app.use('/properties', propertyRoutes);
app.use('/wallets', walletRoutes);
app.use('/payment', paymentRoutes);
app.use('/email', emailRoutes); 
app.use('/investors', investorProfileRoutes);
app.use('/rental-income', rentalIncomeRoutes);

// Démarrer le serveur
app.listen(5001, () => {
  console.log('Serveur en écoute sur le port 5001');
});

