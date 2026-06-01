const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/order.controller');
const { authorize } = require('../middleware/auth.middleware');

router.get('/',             authorize('sales', 'logistics', 'admin'), ctrl.getShipments);
router.post('/',            authorize('logistics', 'admin'),           ctrl.createShipment);
router.patch('/:id/status', authorize('logistics', 'admin'),           ctrl.updateShipment);

module.exports = router;