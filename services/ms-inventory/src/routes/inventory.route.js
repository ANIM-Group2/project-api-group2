const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/inventory.controller');

// Stock
router.get('/',                    ctrl.getStock);           // GET /stock
router.get('/low-stock',           ctrl.getLowStock);        // GET /stock/low-stock
router.post('/adjust',             ctrl.adjustStock);        // POST /stock/adjust
router.get('/log',                 ctrl.getLog);             // GET /stock/log

// Alerts
router.get('/alerts',              ctrl.getAlerts);          // GET /stock/alerts
router.patch('/alerts/:id/ack',    ctrl.ackAlert);           // PATCH /stock/alerts/:id/ack

// Reservations
router.get('/reservations',        ctrl.getReservations);    // GET /stock/reservations
router.post('/reservations',       ctrl.createReservation);  // POST /stock/reservations
router.delete('/reservations/:id', ctrl.releaseReservation); // DELETE /stock/reservations/:id

module.exports = router;