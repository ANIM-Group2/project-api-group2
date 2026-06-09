const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/order.controller');
const { authorize } = require('../middleware/auth.middleware');

router.get('/', authorize('sales', 'admin'), ctrl.getStats);

router.get('/margin-by-product', authorize('admin'), async (req, res) => {
  try {
    const svc = require('../services/order.service');
    res.json(await svc.getMarginByProduct());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;