const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttributeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  info:{
    type: String,
    default : ""
  },
  values: {
    type: [String]
  },
});

module.exports = mongoose.model('Attribute', AttributeSchema);
