const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        trim: true
    }, 
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}); 

var User = mongoose.model('User', UserSchema);
module.exports = {User};