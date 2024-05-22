const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
});

module.exports = mongoose.model('Category', CategorySchema);
