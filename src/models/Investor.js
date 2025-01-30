const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


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
// Hash du mot de passe avant save
investorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Comparer un mot de passe en clair avec le hash
investorSchema.methods.comparePassword = async function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};
module.exports = mongoose.model('Investor', investorSchema);
