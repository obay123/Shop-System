const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: {
         type: String,
          required: true
         },
    owner: { 
        type: String,
         required: true 
        },
    
    // Authentication fields:
    email: { 
        type: String,
         required: true,
         unique: true 
        },
    password: { 
        type: String,
         required: true
         },
});

module.exports = mongoose.model('Shop', shopSchema);
