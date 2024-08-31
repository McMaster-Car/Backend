const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variationId: {
      type: Schema.Types.ObjectId,
      ref: 'Variation',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Schema.Types.Mixed,
      required: true,
    },
  }],
  totalPrice: {
    type: Schema.Types.Mixed,
    required: true,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Order', OrderSchema);
