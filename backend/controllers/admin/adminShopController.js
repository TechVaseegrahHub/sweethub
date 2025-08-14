const Shop = require('../../models/shopModel'); // Updated name
const User = require('../../models/User');
const Role = require('../../models/Role');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

exports.addShop = async (req, res) => {
  const { name, location, username, password } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userExists = await User.findOne({ username }).session(session);
    if (userExists) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'A user with this username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const shopRole = await Role.findOne({ name: 'shop' }).session(session);
    if (!shopRole) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ message: 'Shop role not found. Please create it first.' });
    }

    const newUser = new User({
        name,
        username,
        email: `${username}@sweethubshop.com`,
        password: hashedPassword,
        role: shopRole._id,
        isVerified: true
    });
    await newUser.save({ session });

    const newShop = new Shop({ name, location, user: newUser._id });
    await newShop.save({ session });

    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({ message: 'Shop and user created successfully.', shop: newShop, user: newUser });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error adding shop:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('user', 'username email');
    res.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};