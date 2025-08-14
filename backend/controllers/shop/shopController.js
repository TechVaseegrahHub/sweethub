const Product = require('../../models/productModel'); // Updated name
const Bill = require('../../models/billModel'); // Updated name
const Worker = require('../../models/workerModel'); // Updated name

exports.getShopDashboard = async (req, res) => {
  try {
    const sales = await Bill.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
    ]);
    const totalSales = sales.length > 0 ? sales[0].totalSales : 0;

    const workers = await Worker.find().populate('user', 'name').select('name workingHours');
    
    const products = await Product.find().select('name stockLevel');

    res.status(200).json({
      message: 'Shop dashboard data retrieved successfully.',
      totalSales,
      workers,
      stockLevels: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { newStockLevel } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    product.stockLevel = newStockLevel;
    await product.save();

    res.status(200).json({ message: 'Stock updated successfully.', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};