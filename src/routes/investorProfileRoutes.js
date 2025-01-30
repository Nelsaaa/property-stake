// routes/investorProfileRoutes.js
const express = require('express');
const router = express.Router();
const { createInvestorProfile } = require('../controllers/investorProfileController');

// Route to create a new investor profile
router.post('/profile', createInvestorProfile);

module.exports = router;
