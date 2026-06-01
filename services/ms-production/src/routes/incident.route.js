const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/incident.controller');
const { authorize } = require('../middleware/auth.middleware');

// operator + admin can report and view; admin resolves
router.get('/stats',        authorize('operator', 'admin'), ctrl.getIncidentStats);
router.get('/',             authorize('operator', 'admin'), ctrl.getAllIncidents);
router.get('/:id',          authorize('operator', 'admin'), ctrl.getIncidentById);
router.post('/',            authorize('operator', 'admin'), ctrl.createIncident);
router.patch('/:id/status', authorize('operator', 'admin'), ctrl.updateIncidentStatus);

module.exports = router;