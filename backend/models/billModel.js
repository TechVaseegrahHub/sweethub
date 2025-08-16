const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  customerMobileNumber: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: { // Price at the time of billing
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Card'],
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  billDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bill', billSchema);