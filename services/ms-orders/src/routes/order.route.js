const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/order.controller');
const { authorize } = require('../middleware/auth.middleware');

// logistics can read orders (needed to create shipments)
router.get('/',                authorize('sales', 'logistics', 'admin'), ctrl.getOrders);
router.get('/:id',             authorize('sales', 'logistics', 'admin'), ctrl.getOrder);
router.post('/',               authorize('sales', 'admin'),               ctrl.createOrder);
router.patch('/:id/approve',   authorize('sales', 'admin'),               ctrl.approveOrder);
router.patch('/:id/status',    authorize('admin'),                        ctrl.updateOrderStatus);
router.patch('/:id/cancel',    authorize('sales', 'admin'),               ctrl.cancelOrder);
router.patch('/:id/unapprove', authorize('sales', 'admin'),               ctrl.unapproveOrder);
router.delete('/:id',          authorize('sales', 'admin'),               ctrl.deleteOrder);

module.exports = router;