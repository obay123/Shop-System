const mongoose = require('mongoose')

const milkSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    Price:{
        type:Number,
        default:0.60
    },
    quantity:{
        type:Number,
        default:0,
        required:true
    }   

})