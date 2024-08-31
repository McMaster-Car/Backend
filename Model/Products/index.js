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
  SKU: {
    type: String,
    default: ''
  },
  Parent_Product_ID: {
    type: Number,
    default: null
  },
  attributes: [{
    attributeId: {
      type: Schema.Types.ObjectId,
      ref: 'Attribute'
    },
    values: {
      type: [String]
    }
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  variations: [{
    type: Schema.Types.ObjectId,
    ref: 'Variation'
  }]
});

module.exports = mongoose.model('Product', ProductSchema);
