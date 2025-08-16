const Product = require('../../models/productModel');
const Category = require('../../models/Category');
const mongoose = require('mongoose');

exports.addProduct = async (req, res) => {
  const { name, category, sku, netPrice, sellingPrice, stockLevel, unit, productType } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingCategory = await Category.findById(category).session(session);
    if (!existingCategory) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Category not found.' });
    }

    const newProduct = new Product({
      name,
      category,
      sku,
      netPrice,
      sellingPrice,
      stockLevel,
      unit,
      productType,
    });

    await newProduct.save({ session });

    existingCategory.products.push(newProduct._id);
    await existingCategory.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({ message: 'Product created successfully!', product: newProduct });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (deletedProduct) {
      await Category.findByIdAndUpdate(
          deletedProduct.category,
          { $pull: { products: deletedProduct._id } }
      );
    }
    
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};