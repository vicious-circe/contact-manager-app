const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

UserSchema.pre('save', function(next) {
    var user = this;
  
    if(user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        });
      });
    } else {
      next();
    }
  });

var User = mongoose.model('User', UserSchema);
module.exports = {User};