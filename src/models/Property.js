

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  totalInvested: { type: Number, default: 0 }, 
  type: { 
    type: String, 
    enum: ['apartment', 'building', 'house'], 
  },
  status: { 
    type: String, 
    enum: ['funding', 'funded', 'closed'],
    default: 'funding'
  },
  fundingDeadline: { type: Date },
  ownershipCertificateDelivered: { type: Boolean, default: false }, 
  rentalIncome: { type: Number, default: 0 },
  investments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  }]
});

module.exports = mongoose.model('Property', propertySchema);
