const express = require('express');
const router  = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { Product } = require('../models/production.model');

router.get('/', authenticate, authorize('operator', 'admin'), async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['name', 'ASC']] });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;