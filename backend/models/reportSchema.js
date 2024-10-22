const mongoose = require('mongoose')


const reportSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    soldItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SoldItem',  // Reference to SoldItem
        required: true
    }],
    totalAmount: {
        type: Number,
        default: 0
    }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
