const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/order.controller');
const { authorize } = require('../middleware/auth.middleware');

// sales + admin read and approve; admin-only for status updates
router.get('/',                authorize('sales', 'admin'), ctrl.getOrders);
router.get('/:id',             authorize('sales', 'admin'), ctrl.getOrder);
router.post('/',               authorize('sales', 'admin'), ctrl.createOrder);
router.patch('/:id/approve',   authorize('sales', 'admin'), ctrl.approveOrder);
router.patch('/:id/status',    authorize('admin'),           ctrl.updateOrderStatus);

module.exports = router;