const express = require('express');
const router = express.Router();
const { getShopDashboard, updateStock } = require('../../controllers/shop/shopController');
const { shopAuth } = require('../../middleware/auth');

router.get('/dashboard', shopAuth, getShopDashboard);
router.put('/products/:productId/stock', shopAuth, updateStock);

module.exports = router;