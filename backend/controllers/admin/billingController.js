const Bill = require('../../models/billModel');
const Shop = require('../../models/shopModel');
const Product = require('../../models/productModel');
const mongoose = require('mongoose');

exports.createBill = async (req, res) => {
  const { shopId, customerMobileNumber, customerName, items, totalAmount, paymentMethod, amountPaid } = req.body;

  if (!shopId || !customerMobileNumber || !customerName || !items || !items.length || totalAmount == null || !paymentMethod || amountPaid == null) {
    return res.status(400).json({ message: 'Missing required bill information.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Shop not found.' });
    }

    // Verify products and check stock levels
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Product with ID ${item.product} not found.` });
      }
      if (product.stockLevel < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}. Available: ${product.stockLevel}, Requested: ${item.quantity}.` });
      }
    }

    const newBill = new Bill({
      shop: shopId,
      customerMobileNumber,
      customerName,
      items,
      totalAmount,
      paymentMethod,
      amountPaid,
    });
    await newBill.save({ session });

    // Deduct stock levels
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockLevel: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    const populatedBill = await Bill.findById(newBill._id)
      .populate('shop', 'name location')
      .populate('items.product', 'name sku unit');

    res.status(201).json(populatedBill);
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating bill:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('shop', 'name location')
      .populate('items.product', 'name sku unit'); // Populate product details
    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};