const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttributeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  values: {
    type: [String]
  },
});

module.exports = mongoose.model('Attribute', AttributeSchema);
