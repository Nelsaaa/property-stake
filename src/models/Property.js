

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  type: { 
    type: String, 
    enum: ['apartment', 'building', 'house'], 
    
  },
  status: { 
    type: String, 
    enum: ['funding', 'funded', 'sold'],
    
  },
  fundingDeadline: { type: Date },
  investments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  }]
});

module.exports = mongoose.model('Property', propertySchema);
