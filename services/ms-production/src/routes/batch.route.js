const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/batch.controller');
const { authorize } = require('../middleware/auth.middleware');

// operator + admin can read and update; only admin can create
router.get('/',               authorize('operator', 'admin'), ctrl.getAllBatches);
router.get('/:id',            authorize('operator', 'admin'), ctrl.getBatchById);
router.get('/:id/history',    authorize('operator', 'admin'), ctrl.getBatchHistory);
router.post('/',              authorize('admin'),              ctrl.createBatch);
router.patch('/:id/status',   authorize('operator', 'admin'), ctrl.updateBatchStatus);
router.patch('/:id/quantity', authorize('operator', 'admin'), ctrl.updateBatchQuantity);

module.exports = router;