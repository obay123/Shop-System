const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  soldItems: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    quantitySold: {
      type: Number,
      required: true,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      default: 0
    }
  }]
});

module.exports = mongoose.model('Report', reportSchema);
