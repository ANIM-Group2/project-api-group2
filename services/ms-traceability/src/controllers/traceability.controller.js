const svc = require('../services/traceability.service');

// GET /traceability/batch/:id
const getBatchTrace = async (req, res) => {
  try {
    const { id } = req.params;

    // Operator can only see their own batches
    if (req.user.role === 'operator') {
      const { Batch } = require('../models/trace.model');
      const batch = await Batch.findByPk(id);
      if (!batch) return res.status(404).json({ error: 'Batch not found' });
      if (batch.operator_id !== req.user.userId)
        return res.status(403).json({ error: 'You can only view traceability for your own batches' });
    }

    res.json(await svc.getBatchTrace(id));
  } catch (e) {
    const code = e.message.includes('not found') ? 404 : 500;
    res.status(code).json({ error: e.message });
  }
};

// GET /traceability/incident/:id
const getIncidentTrace = async (req, res) => {
  try {
    res.json(await svc.getIncidentTrace(req.params.id));
  } catch (e) {
    const code = e.message.includes('not found') ? 404 : 500;
    res.status(code).json({ error: e.message });
  }
};

// GET /traceability/order/:id
const getOrderTrace = async (req, res) => {
  try {
    res.json(await svc.getOrderTrace(req.params.id));
  } catch (e) {
    const code = e.message.includes('not found') ? 404 : 500;
    res.status(code).json({ error: e.message });
  }
};

// GET /traceability/material/:id
const getMaterialTrace = async (req, res) => {
  try {
    res.json(await svc.getMaterialTrace(req.params.id));
  } catch (e) {
    const code = e.message.includes('not found') ? 404 : 500;
    res.status(code).json({ error: e.message });
  }
};

// GET /traceability/dashboard
const getDashboard = async (req, res) => {
  try {
    res.json(await svc.getDashboard());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getBatchTrace,
  getIncidentTrace,
  getOrderTrace,
  getMaterialTrace,
  getDashboard,
};