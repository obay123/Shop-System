const mongoose = require('mongoose');

const soldItemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item', // Reference to the Item model
        required: true
    },
    quantitySold: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const SoldItem = mongoose.model('SoldItem', soldItemSchema);
module.exports = SoldItem;
