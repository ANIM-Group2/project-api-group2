const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/order.controller');

// Orders
router.get('/',                ctrl.getOrders);
router.get('/:id',             ctrl.getOrder);
router.post('/',               ctrl.createOrder);
router.patch('/:id/status',    ctrl.updateOrderStatus);

module.exports = router;