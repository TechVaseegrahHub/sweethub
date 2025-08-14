const Bill = require('../../models/billModel'); // Updated name
const Shop = require('../../models/shopModel'); // Updated name
const Product = require('../../models/productModel'); // Updated name

exports.createBill = async (req, res) => {
  const { shopId, items, totalAmount } = req.body;

  if (!shopId || !items || !items.length || totalAmount == null) {
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
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}.` });
      }
    }

    const newBill = new Bill({
      shop: shopId,
      items,
      totalAmount,
    });
    await newBill.save({ session });

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockLevel: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newBill);
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
      .populate('shop', 'name')
      .populate('items.product', 'name price');
    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};