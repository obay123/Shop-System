const mongoose = require("mongoose");

const debtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  items: [
    {
      itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Item", 
        required: true 
      }, // Reference to the Item schema
      quantity: { 
        type: Number, 
        required: true 
      }, // Stores the quantity purchased
    },
  ],
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
});

const Debt = mongoose.model("Debt", debtSchema);
module.exports = Debt;
