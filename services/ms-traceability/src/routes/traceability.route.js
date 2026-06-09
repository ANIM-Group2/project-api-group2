// const express = require('express');
// const router  = express.Router();
// const ctrl    = require('../controllers/traceability.controller');
// const { authorize } = require('../middleware/auth.middleware');

// // Batch trace — operator (own batches only, enforced in controller), logistics, sales, admin
// router.get('/batch/:id',    authorize('operator', 'logistics', 'sales', 'admin'), ctrl.getBatchTrace);

// // Incident trace — logistics, sales, admin (not operator — they report, not investigate)
// router.get('/incident/:id', authorize('logistics', 'sales', 'admin'), ctrl.getIncidentTrace);

// // Order trace — sales and admin only
// router.get('/order/:id',    authorize('sales', 'admin'), ctrl.getOrderTrace);

// // Material trace — logistics and admin only
// router.get('/material/:id', authorize('logistics', 'admin'), ctrl.getMaterialTrace);

// // Executive dashboard — admin only
// router.get('/dashboard',    authorize('admin'), ctrl.getDashboard);

// // POST /traceability/reports — save KPI report to MongoDB
router.post('/reports', authorize('admin'), async (req, res) => {
  try {
    const KpiReport = require('../models/kpi-report.model');
    const report = await KpiReport.create({
      ...req.body,
      generated_by: req.user?.userId,
      generated_at: new Date(),
    });
    res.status(201).json({ saved: true, id: report._id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /traceability/reports — list saved reports
router.get('/reports', authorize('admin'), async (req, res) => {
  try {
    const KpiReport = require('../models/kpi-report.model');
    const reports = await KpiReport.find().sort({ generated_at: -1 }).limit(20);
    res.json(reports);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;





const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/traceability.controller');
const { authorize } = require('../middleware/auth.middleware');

// All recent logs — admin only
router.get('/logs',         authorize('admin'), ctrl.getAllLogs);

// Batch trace
router.get('/batch/:id',    authorize('operator', 'logistics', 'sales', 'admin'), ctrl.getBatchTrace);

// Incident trace
router.get('/incident/:id', authorize('logistics', 'sales', 'admin'), ctrl.getIncidentTrace);

// Order trace
router.get('/order/:id',    authorize('sales', 'admin'), ctrl.getOrderTrace);

// Material trace
router.get('/material/:id', authorize('logistics', 'admin'), ctrl.getMaterialTrace);

// Executive dashboard
router.get('/dashboard',    authorize('admin'), ctrl.getDashboard);

// Inter-service: receive events from other microservices
router.post('/event',       authorize('operator', 'logistics', 'sales', 'admin'), ctrl.logEvent);

// POST /traceability/reports — save KPI report to MongoDB
router.post('/reports', authorize('admin'), async (req, res) => {
  try {
    const KpiReport = require('../models/kpi-report.model');
    const report = await KpiReport.create({
      ...req.body,
      generated_by: req.user?.userId,
      generated_at: new Date(),
    });
    res.status(201).json({ saved: true, id: report._id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /traceability/reports — list saved reports
router.get('/reports', authorize('admin'), async (req, res) => {
  try {
    const KpiReport = require('../models/kpi-report.model');
    const reports = await KpiReport.find().sort({ generated_at: -1 }).limit(20);
    res.json(reports);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;