
const InvestorProfile = require('../models/InvestorProfile');

const createInvestorProfile = async (req, res) => {
  const { fullName, identificationNumber, address, email, phoneNumber, nationality, dateOfBirth } = req.body;

  try {
    // Create a new investor profile
    const newInvestorProfile = new InvestorProfile({
      fullName,
      identificationNumber,
      address,
      email,
      phoneNumber,
      nationality,
      dateOfBirth,
    });

    // Save the profile to the database
    const savedProfile = await newInvestorProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ message: 'Error creating investor profile', error });
  }
};

module.exports = { createInvestorProfile };
