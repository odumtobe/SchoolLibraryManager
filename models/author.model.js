const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
  
    bio: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true,
            validate: {
                validator: function (value) {
                    return value = new Date();
                },
        },
    },
}, { timestamps: true });
module.exports = mongoose.model('Author', authorSchema);