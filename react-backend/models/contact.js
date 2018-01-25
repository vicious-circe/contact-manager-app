const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: [true, 'Specify the contact name'],
      minlength: 1,
      trim: true
    },

    phone_number: {
      type: String,
      required: [false, 'Specify phone number'],
      minlength: 10,
      trim: true
    },

    email: {
        type: String,
        required: [false, 'Specify email'],
        trim: true,
        minlength: 1,
        unique: true
    }  
});

var Contact = mongoose.model('Contact', ContactSchema);
module.exports = {Contact};
