const mongoose = require("mongoose");

const debtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {  // renamed from 'quantity'
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  items: [
    {
      itemName: { type: String, required: false, default:'سلعة'},  // could also store product info
      quantity: { type: Number, required: false }
    }
  ]
});

const Debt = mongoose.model('Debt', debtSchema);
module.exports = Debt;
