const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantitySold: {
    type: Number,
    required: true
  },
  dateSold: {
    type: Date,
    default: Date.now
  }
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
