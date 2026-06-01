const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/order.controller');
const { authorize } = require('../middleware/auth.middleware');

router.get('/', authorize('sales', 'admin'), ctrl.getCustomers);

module.exports = router;