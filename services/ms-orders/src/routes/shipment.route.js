const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/order.controller');

router.post('/',            ctrl.createShipment);
router.patch('/:id/status', ctrl.updateShipment);

module.exports = router;