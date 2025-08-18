const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  netPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v >= this.netPrice;
      },
      message: props => `Selling price (${props.value}) must be greater than or equal to the net price (${props.path}).`
    }
  },
  stockLevel: {
    type: Number,
    default: 0,
  },
  stockAlertThreshold: {
    type: Number,
    default: 10,
  },
  unit: {
    type: String,
    required: true,
    default: 'piece',
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