const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  amountInvested: { type: Number, required: true },
  sharePercentage: { type: Number, required: true },
  dateInvested: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investment', investmentSchema);
