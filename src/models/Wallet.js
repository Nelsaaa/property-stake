const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
  },
  transactions: [
    {
      type: { type: String, enum: ['fund', 'rental_income', 'investment'] },
      amount: { type: Number, default: 0},
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Wallet', walletSchema);
