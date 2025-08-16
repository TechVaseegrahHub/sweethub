const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Role = require('./models/Role');
const Department = require('./models/departmentModel');
const Worker = require('./models/workerModel');
const Shop = require('./models/shopModel');
const Product = require('./models/productModel');
const Bill = require('./models/billModel');
const Attendance = require('./models/attendanceModel');
const Task = require('./models/task');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected...');
    initializeRolesAndAdmin();
  })
  .catch(err => console.error('MongoDB connection error:', err));

const initializeRolesAndAdmin = async () => {
    try {
      let adminRole = await Role.findOne({ name: 'admin' });
      if (!adminRole) {
        adminRole = new Role({ name: 'admin' });
        await adminRole.save();
        console.log('Admin role created.');
      }

      let workerRole = await Role.findOne({ name: 'worker' });
      if (!workerRole) {
        workerRole = new Role({ name: 'worker' });
        await workerRole.save();
        console.log('Worker role created.');
      }
      
      let shopRole = await Role.findOne({ name: 'shop' });
      if (!shopRole) {
        shopRole = new Role({ name: 'shop' });
        await shopRole.save();
        console.log('Shop role created.');
      }
  
      const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (adminExists) {
        console.log('Admin user already exists. Skipping initialization.');
        return;
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
  
      const newAdmin = new User({
        name: 'Admin',
        username: 'admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: adminRole._id,
        isVerified: true
      });
  
      await newAdmin.save();
      console.log('Default admin user created successfully.');
    } catch (error) {
      console.error('Error initializing roles and admin user:', error);
    }
};

// Import Routes
const departmentRoutes = require('./routes/admin/adminDepartmentRoutes');
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/admin/adminWorkerRoutes');
const productRoutes = require('./routes/admin/adminProductRoutes');
const billingRoutes = require('./routes/admin/adminBillRoutes');
const salaryRoutes = require('./routes/admin/salaryRoutes');
const shopAdminRoutes = require('./routes/admin/adminShopRoutes');
const shopRoutes = require('./routes/shop/shopRoutes');
const attendanceRoutes = require('./routes/admin/adminAttendanceRoutes');


// Use Routes
app.use('/api/admin/departments', departmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/workers', workerRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/billing', billingRoutes);
app.use('/api/admin/salary', salaryRoutes);
app.use('/api/admin/shops', shopAdminRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/admin/attendance', attendanceRoutes);

app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));