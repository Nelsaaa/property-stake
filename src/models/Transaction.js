const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
    
  },
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['investment', 'rental_income', 'refund'],
    
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
