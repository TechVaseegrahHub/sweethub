const express = require('express');
const router = express.Router();
const { getTodaysAttendance, checkIn, checkOut, getMonthlyAttendance } = require('../../controllers/admin/attendanceController');
const { adminAuth } = require('../../middleware/auth');

router.get('/', adminAuth, getTodaysAttendance);
router.post('/checkin', adminAuth, checkIn);
router.post('/checkout', adminAuth, checkOut);


module.exports = router;
router.get('/monthly/:year/:month', adminAuth, getMonthlyAttendance);