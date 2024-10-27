const mongoose = require('mongoose');

const soldItemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantitySold: {
        type: Number,
        required: true,
        default:0
    },
    total: {
        type: Number,
        required: true
    }
});

module.exports = soldItemSchema;
