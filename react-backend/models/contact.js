const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    contact_name: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
    },

    phone_number: {
      type: Number,
      required: false,
      minlength: 10,
      trim: true
    },

    email: {
        type: String,
        required: false,
        trim: true,
        minlength: 1,
        unique: true
    }  

});

var Contact = mongoose.model('Contact', ContactSchema);
module.exports = {Contact};
