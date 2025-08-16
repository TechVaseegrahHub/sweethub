const express = require('express');
const router = express.Router();
const { addWorker, getWorkers, updateWorker, deleteWorker } = require('../../controllers/admin/workerController');
const { adminAuth } = require('../../middleware/auth'); 

router.post('/', adminAuth, addWorker);
router.get('/', adminAuth, getWorkers);
router.put('/:id', adminAuth, updateWorker);
router.delete('/:id', adminAuth, deleteWorker);

module.exports = router;