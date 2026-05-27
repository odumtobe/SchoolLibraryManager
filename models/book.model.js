const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },
    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
   }],
 
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        default: null
    },
    issueDate: {
        type: Date,
        default: Date.now()
    },

    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Librarian',
        default: null
    },
    dateReturned: {
        type: Date,
        default: Date.now()
    }

    
}, { timestamps: true });
module.exports = mongoose.model('Book', bookSchema);
