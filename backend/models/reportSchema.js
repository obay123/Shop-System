const mongoose = require('mongoose');
const soldItemSchema = require('./soldItemSchema');

const reportSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        unique: true
    },
    soldItems: [soldItemSchema], // Embed sold items directly
    totalAmount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Report', reportSchema);
