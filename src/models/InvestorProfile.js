// models/InvestorProfile.js
const mongoose = require('mongoose');

const investorProfileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  identificationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  
}, {
  timestamps: true,
});

module.exports = mongoose.model('InvestorProfile', investorProfileSchema);
