const { RawMaterial, Supplier, MaterialReservation } = require('../models/inventory.model');
const { StockMovement, StockAlert } = require('../models/stock-log.model');

// GET all stock — available = stock_quantity - reserved_quantity
async function getStock(filters = {}) {
  const where = {};
  if (filters.material_id) where.material_id = filters.material_id;

  const materials = await RawMaterial.findAll({
    where,
    include: [{ model: Supplier, as: 'supplier' }],
    order: [['name', 'ASC']],
  });

  return materials.map(m => {
    const available = parseFloat(m.stock_quantity) - parseFloat(m.reserved_quantity);
    let status = 'ok';
    if (available <= 0) status = 'critical';
    else if (available <= parseFloat(m.safety_threshold)) status = 'low';

    return {
      ...m.toJSON(),
      available_quantity: available,
      status,
    };
  });
}

// GET materials below safety threshold
async function getLowStock() {
  const all = await getStock();
  return all.filter(m => m.status !== 'ok');
}

// POST adjust stock — adds/removes from stock_quantity, logs to MongoDB
async function adjustStock(materialId, delta, reason, referenceDoc, userId) {
  const mat = await RawMaterial.findByPk(materialId);
  if (!mat) throw new Error('Material not found');

  const previous_qty = parseFloat(mat.stock_quantity);
  const new_qty      = Math.max(0, previous_qty + parseFloat(delta));

  await mat.update({ stock_quantity: new_qty });

  // Log to MongoDB
  await StockMovement.create({
    product_id:    materialId,
    product_ref:   mat.reference,
    site_id:       1, // default site
    movement_type: delta >= 0 ? 'entry' : 'exit',
    quantity:      Math.abs(delta),
    previous_qty,
    new_qty,
    reason,
    reference_doc: referenceDoc,
    performed_by:  userId ? parseInt(userId) : null,
  });

  // Check if low stock alert needed
  const available = new_qty - parseFloat(mat.reserved_quantity);
  if (available <= parseFloat(mat.safety_threshold)) {
    const existing = await StockAlert.findOne({ product_id: materialId, status: 'active' });
    if (!existing) {
      await StockAlert.create({
        product_id:  materialId,
        product_ref: mat.reference,
        site_id:     1,
        alert_type:  available <= 0 ? 'out_of_stock' : 'low_stock',
        current_qty: available,
        threshold:   parseFloat(mat.safety_threshold),
      });
    }
  }

  const updatedMat = await RawMaterial.findByPk(materialId);
  const newAvailable = parseFloat(updatedMat.stock_quantity) - parseFloat(updatedMat.reserved_quantity);
  return {
    ...updatedMat.toJSON(),
    available_quantity: newAvailable,
  };
}

// GET movement log from MongoDB
async function getMovementLog(materialId) {
  const filter = materialId ? { product_id: Number(materialId) } : {};
  return StockMovement.find(filter).sort({ performed_at: -1 }).limit(100);
}

// GET active alerts from MongoDB
async function getAlerts(status = 'active') {
  return StockAlert.find({ status }).sort({ created_at: -1 });
}

// PATCH acknowledge alert
async function acknowledgeAlert(alertId) {
  return StockAlert.findByIdAndUpdate(alertId, { status: 'acknowledged' }, { new: true });
}

// GET all reservations (active + released)
async function getReservations() {
  return MaterialReservation.findAll({
    include: [{ model: RawMaterial, as: 'material', attributes: ['reference', 'name', 'unit'] }],
    order: [['reserved_at', 'DESC']],
  });
}

// POST create reservation — prevents double allocation
async function createReservation(materialId, productionOrderId, quantity) {
  const mat = await RawMaterial.findByPk(materialId);
  if (!mat) throw new Error('Material not found');

  const available = parseFloat(mat.stock_quantity) - parseFloat(mat.reserved_quantity);
  if (available < quantity) {
    throw new Error(`Insufficient stock. Available: ${available} ${mat.unit}, requested: ${quantity}`);
  }

  // Update reserved_quantity
  await mat.update({ reserved_quantity: parseFloat(mat.reserved_quantity) + parseFloat(quantity) });

  const reservation = await MaterialReservation.create({
    material_id: materialId,
    production_order_id: productionOrderId,
    quantity_reserved: quantity,
    is_active: true,
  });

  await StockMovement.create({
    product_id:    materialId,
    product_ref:   mat.reference,
    site_id:       1,
    movement_type: 'reservation',
    quantity:      parseFloat(quantity),
    previous_qty:  parseFloat(mat.stock_quantity),
    new_qty:       parseFloat(mat.stock_quantity),
    reason:        `Reserved for production order ${productionOrderId}`,
    reference_doc: `PO-${productionOrderId}`,
  });

  return reservation;
}

// DELETE release reservation
async function releaseReservation(reservationId) {
  const res = await MaterialReservation.findByPk(reservationId);
  if (!res || !res.is_active) throw new Error('Reservation not found or already released');

  const mat = await RawMaterial.findByPk(res.material_id);
  await mat.update({
    reserved_quantity: Math.max(0, parseFloat(mat.reserved_quantity) - parseFloat(res.quantity_reserved)),
  });

  await res.update({ is_active: false, released_at: new Date() });
  return { message: 'Reservation released', reservation: res };
}

module.exports = {
  getStock, getLowStock, adjustStock,
  getMovementLog, getAlerts, acknowledgeAlert,
  getReservations, createReservation, releaseReservation,
};