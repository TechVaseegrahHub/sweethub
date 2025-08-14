const express = require('express');
const router = express.Router();
const { createBill, getBills } = require('../../controllers/admin/billingController');
const { adminAuth } = require('../../middleware/auth');

router.post('/', adminAuth, createBill);
router.get('/', adminAuth, getBills);

module.exports = router;    