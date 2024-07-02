const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VariationSchema = new Schema({
  attributes: [{
    attributeId: {
      type: Schema.Types.ObjectId,
      ref: 'Attribute'
    },
    value: {
      type: String,
    }
  }],
  retailPrice: {
    type: Schema.Types.Mixed,
  },
  salePrice: {
    type: Schema.Types.Mixed,
  },
  stockQuantity: {
    type: Schema.Types.Mixed,
  },
  isStockAvailable: {
    type: Boolean,
    default: true,
  },
  picture: {
    type: String,
  },
  weight: {
    type: Schema.Types.Mixed,
  },
  dimensions: {
    L: {
      type: Schema.Types.Mixed,
    },
    W: {
      type: Schema.Types.Mixed,
    },
    H: {
      type: Schema.Types.Mixed,
    },
  },
  others: {
    type: Map,
    of: Schema.Types.Mixed
  }
});

const Variation = mongoose.model('Variation', VariationSchema);

module.exports = Variation;
