const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
  }
});

module.exports = mongoose.model('Wallet', walletSchema);
