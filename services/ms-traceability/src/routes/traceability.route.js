const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/traceability.controller');
const { authorize } = require('../middleware/auth.middleware');

// Batch trace — operator (own batches only, enforced in controller), logistics, sales, admin
router.get('/batch/:id',    authorize('operator', 'logistics', 'sales', 'admin'), ctrl.getBatchTrace);

// Incident trace — logistics, sales, admin (not operator — they report, not investigate)
router.get('/incident/:id', authorize('logistics', 'sales', 'admin'), ctrl.getIncidentTrace);

// Order trace — sales and admin only
router.get('/order/:id',    authorize('sales', 'admin'), ctrl.getOrderTrace);

// Material trace — logistics and admin only
router.get('/material/:id', authorize('logistics', 'admin'), ctrl.getMaterialTrace);

// Executive dashboard — admin only
router.get('/dashboard',    authorize('admin'), ctrl.getDashboard);

module.exports = router;