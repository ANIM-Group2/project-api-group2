const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/production.controller');
const { authorize } = require('../middleware/auth.middleware');

// operator + admin can read; only admin can create/update orders
router.get('/products', authorize('operator', 'admin'), ctrl.getProducts);
router.get('/kpis',         authorize('operator', 'admin'), ctrl.getKPIs);
router.get('/',             authorize('operator', 'logistics', 'admin'), ctrl.getAllOrders);
router.get('/:id',          authorize('operator', 'admin'), ctrl.getOrderById);
router.post('/',            authorize('admin'),              ctrl.createOrder);
router.patch('/:id/status', authorize('admin'),              ctrl.updateOrderStatus);

module.exports = router;