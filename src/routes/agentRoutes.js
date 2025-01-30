const express = require('express');
const router = express.Router();
const { createAgent, loginAgent, getAllAgents } = require('../controllers/agentController');

// Créer un agent
router.post('/register', createAgent);
// Login agent
router.post('/login', loginAgent);

router.get('/', getAllAgents);

module.exports = router;
