const mongoose = require("mongoose");

const debtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
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
      itemName: { type: String, required: true },  // Stores the name of the item
      price: { type: Number, required: true },     // Stores the price of each item
      quantity: { type: Number, required: true }   // Stores the quantity purchased
    }
  ],
  shopId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop', 
      required: true 
    },
});

const Debt = mongoose.model('Debt', debtSchema);
module.exports = Debt;
