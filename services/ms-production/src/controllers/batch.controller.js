// const svc = require('../services/batch.service');

// // GET /production/batches
// const getAllBatches = async (req, res) => {
//   try {
//     res.json(await svc.getAllBatches(req.query));
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };

// // GET /production/batches/:id
// const getBatchById = async (req, res) => {
//   try {
//     res.json(await svc.getBatchById(req.params.id));
//   } catch (e) {
//     const status = e.message.includes('not found') ? 404 : 500;
//     res.status(status).json({ error: e.message });
//   }
// };

// // POST /production/batches
// const createBatch = async (req, res) => {
//   try {
//     res.status(201).json(await svc.createBatch(req.body));
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// };

// // PATCH /production/batches/:id/status
// const updateBatchStatus = async (req, res) => {
//   try {
//     const { status, notes } = req.body;
//     if (!status) return res.status(400).json({ error: 'status is required' });
//     const operatorId = req.headers['x-user-id'];
//     res.json(await svc.updateBatchStatus(req.params.id, status, operatorId, notes));
//   } catch (e) {
//     const status = e.message.includes('not found') ? 404 : 400;
//     res.status(status).json({ error: e.message });
//   }
// };

// // PATCH /production/batches/:id/quantity
// const updateBatchQuantity = async (req, res) => {
//   try {
//     const { quantity_produced } = req.body;
//     if (quantity_produced === undefined)
//       return res.status(400).json({ error: 'quantity_produced is required' });
//     res.json(await svc.updateBatchQuantity(req.params.id, quantity_produced));
//   } catch (e) {
//     const status = e.message.includes('not found') ? 404 : 400;
//     res.status(status).json({ error: e.message });
//   }
// };

// // GET /production/batches/:id/history
// const getBatchHistory = async (req, res) => {
//   try {
//     res.json(await svc.getBatchHistory(req.params.id));
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };

// module.exports = {
//   getAllBatches, getBatchById, createBatch,
//   updateBatchStatus, updateBatchQuantity, getBatchHistory,
// };



const tracer = require('../services/traceability.client');
const svc = require('../services/batch.service');

// GET /production/batches
const getAllBatches = async (req, res) => {
  try {
    res.json(await svc.getAllBatches(req.query));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /production/batches/:id
const getBatchById = async (req, res) => {
  try {
    res.json(await svc.getBatchById(req.params.id));
  } catch (e) {
    const status = e.message.includes('not found') ? 404 : 500;
    res.status(status).json({ error: e.message });
  }
};

// POST /production/batches
const createBatch = async (req, res) => {
  try {
    res.status(201).json(await svc.createBatch(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// PATCH /production/batches/:id/status
const updateBatchStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!status) return res.status(400).json({ error: 'status is required' });
    const operatorId = req.headers['x-user-id'];
    const prev  = await svc.getBatchById(req.params.id);
    const batch = await svc.updateBatchStatus(req.params.id, status, operatorId, notes);
    // Inter-service: notify traceability
    const token = req.headers['authorization']?.split(' ')[1];
    tracer.logEvent('batch_status_change', {
      batch_id:        batch.batch_id,
      batch_number:    batch.batch_number,
      previous_status: prev?.status,
      new_status:      batch.status,
      operator_id:     operatorId,
      actor_name:      `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || req.headers['x-user-name'] || `#${operatorId}`,
      notes:           notes,
    }, token);
    res.json(batch);
  } catch (e) {
    const status = e.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: e.message });
  }
};

// PATCH /production/batches/:id/quantity
const updateBatchQuantity = async (req, res) => {
  try {
    const { quantity_produced } = req.body;
    if (quantity_produced === undefined)
      return res.status(400).json({ error: 'quantity_produced is required' });
    res.json(await svc.updateBatchQuantity(req.params.id, quantity_produced));
  } catch (e) {
    const status = e.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: e.message });
  }
};

// GET /production/batches/:id/history
const getBatchHistory = async (req, res) => {
  try {
    res.json(await svc.getBatchHistory(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getAllBatches, getBatchById, createBatch,
  updateBatchStatus, updateBatchQuantity, getBatchHistory,
};