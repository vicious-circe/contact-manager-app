const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1, 
        unique: true
    }, 
    password: {
        type: String, 
        required: true, 
        minlength: 6
    }, 
    _userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    }
}); 

var Contact = mongoose.model('Contact', ContactSchema);
module.exports = {Contact};