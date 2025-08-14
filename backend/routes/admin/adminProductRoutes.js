const express = require('express');
const router = express.Router();
const { addProduct, getProducts, updateProduct, deleteProduct } = require('../../controllers/admin/productController');
const { adminAuth } = require('../../middleware/auth');

router.post('/', adminAuth, addProduct);
router.get('/', adminAuth, getProducts);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;