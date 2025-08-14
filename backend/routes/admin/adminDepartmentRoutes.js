const express = require('express');
const router = express.Router();
const { createDepartment, getDepartments } = require('../../controllers/admin/departmentController');
const { adminAuth } = require('../../middleware/auth'); 

router.post('/', adminAuth, createDepartment);
router.get('/', adminAuth, getDepartments);

module.exports = router;