const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/inventory.controller');
const { authorize } = require('../middleware/auth.middleware');

// Stock — logistics + admin read; only admin adjusts
router.get('/',                    authorize('logistics', 'admin'), ctrl.getStock);
router.get('/low-stock',           authorize('logistics', 'admin'), ctrl.getLowStock);
router.post('/adjust',             authorize('admin'),               ctrl.adjustStock);
router.get('/log',                 authorize('logistics', 'admin'), ctrl.getLog);

// Alerts — logistics + admin
router.get('/alerts',              authorize('logistics', 'admin'), ctrl.getAlerts);
router.patch('/alerts/:id/ack',    authorize('logistics', 'admin'), ctrl.ackAlert);

// Reservations — logistics + admin create; admin releases
router.get('/reservations',        authorize('logistics', 'admin'), ctrl.getReservations);
router.post('/reservations',       authorize('logistics', 'admin'), ctrl.createReservation);
router.delete('/reservations/:id', authorize('logistics', 'admin'), ctrl.releaseReservation);

module.exports = router;