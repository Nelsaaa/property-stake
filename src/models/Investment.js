const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',

  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    
  },
  amountInvested: { type: Number, required: true },
  shares: { type: Number, required: true },
  dateInvested: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investment', investmentSchema);
