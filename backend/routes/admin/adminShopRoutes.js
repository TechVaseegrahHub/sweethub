const express = require('express');
const router = express.Router();
const { addShop, getShops } = require('../../controllers/admin/adminShopController');
const { adminAuth } = require('../../middleware/auth');

router.post('/', adminAuth, addShop);
router.get('/', adminAuth, getShops);

module.exports = router;