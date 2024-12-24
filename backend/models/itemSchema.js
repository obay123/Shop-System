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

    shopId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Shop',
         required: true },
});

module.exports = mongoose.model('Item', itemSchema);
