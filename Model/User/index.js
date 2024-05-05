const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default : false
  },
  contact_no:{
    type: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User