const { Batch, ProductionOrder, Product, User, Incident } = require('../models/production.model');
const { BatchActionLog } = require('../models/action-log.model');

async function getAllBatches(filters = {}) {
  const where = {};
  if (filters.status)              where.status              = filters.status;
  if (filters.production_order_id) where.production_order_id = filters.production_order_id;

  return Batch.findAll({
    where,
    include: [
      {
        model: ProductionOrder, as: 'production_order',
        include: [{ model: Product, as: 'product', attributes: ['name', 'reference'] }],
      },
      { model: User, as: 'operator', attributes: ['first_name', 'last_name'] },
    ],
    order: [['manufacturing_date', 'DESC']],
  });
}

async function getBatchById(id) {
  const batch = await Batch.findByPk(id, {
    include: [
      {
        model: ProductionOrder, as: 'production_order',
        include: [{ model: Product, as: 'product' }],
      },
      { model: User,     as: 'operator' },
      { model: Incident, as: 'incidents', include: [{ model: User, as: 'reporter', attributes: ['first_name', 'last_name'] }] },
    ],
  });
  if (!batch) throw new Error('Batch not found');
  return batch;
}

async function createBatch(data) {
  const { production_order_id, operator_id, batch_number, quantity_produced, notes } = data;
  if (!production_order_id || !batch_number)
    throw new Error('Missing required fields: production_order_id, batch_number');

  const batch = await Batch.create({
    production_order_id, operator_id,
    batch_number, quantity_produced: quantity_produced || 0,
    notes, status: 'planned',
  });

  // Log to MongoDB
  await BatchActionLog.create({
    batch_id:     batch.batch_id,
    batch_number: batch.batch_number,
    action:       'created',
    new_status:   'planned',
    operator_id,
  });

  return batch;
}

async function updateBatchStatus(id, status, operator_id, notes) {
  const batch = await Batch.findByPk(id);
  if (!batch) throw new Error('Batch not found');

  const previous_status = batch.status;
  await batch.update({ status, notes: notes || batch.notes });

  // Log status change to MongoDB
  await BatchActionLog.create({
    batch_id:        batch.batch_id,
    batch_number:    batch.batch_number,
    action:          'status_changed',
    previous_status,
    new_status:      status,
    operator_id,
    notes,
  });

  return batch;
}

async function updateBatchQuantity(id, quantity_produced) {
  const batch = await Batch.findByPk(id);
  if (!batch) throw new Error('Batch not found');
  await batch.update({ quantity_produced });
  return batch;
}

// Full action history from MongoDB for a batch
async function getBatchHistory(batchId) {
  return BatchActionLog.find({ batch_id: Number(batchId) }).sort({ timestamp: 1 });
}

module.exports = {
  getAllBatches, getBatchById, createBatch,
  updateBatchStatus, updateBatchQuantity, getBatchHistory,
};