const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String},
  password: { type: String },
  wallet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Wallet' 
  },
  investments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  }]
});

module.exports = mongoose.model('Investor', investorSchema);
