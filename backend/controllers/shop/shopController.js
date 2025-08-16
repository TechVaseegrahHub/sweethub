const Product = require('../../models/productModel'); // Updated import
const Bill = require('../../models/billModel'); // Updated import
const Worker = require('../../models/workerModel'); // Updated import

exports.getShopDashboard = async (req, res) => {
  try {
    // Fetch total sales for the shop (assuming shop ID is available from auth or query)
    // For now, let's just get overall sales for simplicity, you'd filter by shop in a real app
    const sales = await Bill.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
    ]);
    const totalSales = sales.length > 0 ? sales[0].totalSales : 0;

    const workers = await Worker.find().populate('user', 'name').select('name workingHours');
    
    // Fetch products with their current stock levels
    const products = await Product.find().select('name stockLevel unit');

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