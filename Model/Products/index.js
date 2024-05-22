// product.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  attributes: [{
    attributeId: {
      type: Schema.Types.ObjectId,
      ref: 'Attribute'
    },
    value: {
      type: String,
      required: true
    }
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]   
});

module.exports = mongoose.model('Product', ProductSchema);
