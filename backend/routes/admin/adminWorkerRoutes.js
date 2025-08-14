const express = require('express');
const router = express.Router();
const { addWorker, getWorkers } = require('../../controllers/admin/workerController');
const { adminAuth } = require('../../middleware/auth'); 

router.post('/', adminAuth, addWorker);
router.get('/', adminAuth, getWorkers);

module.exports = router;