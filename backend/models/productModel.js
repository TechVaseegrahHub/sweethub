const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stockLevel: {
    type: Number,
    default: 0,
  },
  productType: {
    type: String,
    enum: ['raw_material', 'finished_product'],
    required: true,
  },
  shopStock: [{
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    stockLevel: {
      type: Number,
      default: 0,
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);