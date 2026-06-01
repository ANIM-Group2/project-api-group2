const {
  Batch, ProductionOrder, Incident,
  Product, Site, User,
  RawMaterial, BatchMaterial, MaterialReservation,
} = require('../models/trace.model');

const { BatchActionLog, IncidentLog, StockMovement } = require('../models/audit-log.model');

// ─────────────────────────────────────────────────────────────────────────────
// BATCH TRACEABILITY — the German customer scenario
// Reconstructs the complete life of a batch from both DBs
// ─────────────────────────────────────────────────────────────────────────────

async function getBatchTrace(batchId) {
  // 1. Core batch data from PostgreSQL
  const batch = await Batch.findByPk(batchId, {
    include: [
      {
        model: ProductionOrder, as: 'production_order',
        include: [
          { model: Product, as: 'product' },
          { model: Site,    as: 'site' },
          { model: User,    as: 'creator', attributes: ['first_name', 'last_name', 'email'] },
        ],
      },
      { model: User, as: 'operator', attributes: ['first_name', 'last_name', 'email'] },
      {
        model: Incident, as: 'incidents',
        include: [{ model: User, as: 'reporter', attributes: ['first_name', 'last_name'] }],
      },
    ],
  });

  if (!batch) throw new Error('Batch not found');

  // 2. Materials used in this batch from PostgreSQL
  const materials = await BatchMaterial.findAll({
    where: { batch_id: batchId },
    include: [{ model: RawMaterial, as: 'material', attributes: ['reference', 'name', 'unit'] }],
  });

  // 3. Full action history from MongoDB (sorted oldest → newest)
  const [actionLogs, incidentLogs] = await Promise.all([
    BatchActionLog.find({ batch_id: Number(batchId) }).sort({ timestamp: 1 }),
    IncidentLog.find({ batch_id: Number(batchId) }).sort({ timestamp: 1 }),
  ]);

  // 4. Merge and sort all events into a unified timeline
  const timeline = [
    ...actionLogs.map(e => ({
      type:      'batch_action',
      action:    e.action,
      from:      e.previous_status,
      to:        e.new_status,
      operator:  e.operator_id,
      notes:     e.notes,
      timestamp: e.timestamp,
    })),
    ...incidentLogs.map(e => ({
      type:      'incident',
      action:    e.action,
      title:     e.title,
      severity:  e.severity,
      status:    e.new_status,
      reporter:  e.reported_by,
      timestamp: e.timestamp,
    })),
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return {
    batch,
    materials_used: materials,
    timeline,
    summary: {
      total_events:    timeline.length,
      incidents_count: batch.incidents.length,
      critical_incidents: batch.incidents.filter(i => i.severity === 'critical').length,
      current_status:  batch.status,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// INCIDENT TRACEABILITY — full context for a single incident
// ─────────────────────────────────────────────────────────────────────────────

async function getIncidentTrace(incidentId) {
  const incident = await Incident.findByPk(incidentId, {
    include: [
      {
        model: Batch, as: 'batch',
        include: [
          {
            model: ProductionOrder, as: 'production_order',
            include: [
              { model: Product, as: 'product' },
              { model: Site,    as: 'site' },
            ],
          },
        ],
      },
      { model: User, as: 'reporter', attributes: ['first_name', 'last_name', 'email'] },
    ],
  });

  if (!incident) throw new Error('Incident not found');

  // Audit trail for this incident from MongoDB
  const logs = await IncidentLog
    .find({ incident_id: Number(incidentId) })
    .sort({ timestamp: 1 });

  return { incident, audit_trail: logs };
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER TRACEABILITY — end-to-end from customer order to delivery
// ─────────────────────────────────────────────────────────────────────────────

async function getOrderTrace(customerOrderId) {
  // Find all production orders linked to this customer order
  const productionOrders = await ProductionOrder.findAll({
    where: { customer_order_id: customerOrderId },
    include: [
      { model: Product, as: 'product' },
      { model: Site,    as: 'site' },
      {
        model: Batch, as: 'batches',
        include: [
          { model: Incident, as: 'incidents' },
          { model: User,     as: 'operator', attributes: ['first_name', 'last_name'] },
        ],
      },
    ],
  });

  if (!productionOrders.length)
    throw new Error('No production orders found for this customer order');

  // Material reservations for all production orders
  const orderIds = productionOrders.map(o => o.production_order_id);
  const reservations = await MaterialReservation.findAll({
    where: { production_order_id: orderIds },
    include: [{ model: RawMaterial, as: 'material', attributes: ['reference', 'name', 'unit'] }],
  });

  // All batch IDs across all production orders
  const batchIds = productionOrders.flatMap(o => o.batches.map(b => b.batch_id));

  // Fetch all batch action logs from MongoDB in one query
  const batchLogs = await BatchActionLog
    .find({ batch_id: { $in: batchIds } })
    .sort({ timestamp: 1 });

  return {
    customer_order_id: customerOrderId,
    production_orders: productionOrders,
    material_reservations: reservations,
    batch_events: batchLogs,
    summary: {
      production_orders_count: productionOrders.length,
      total_batches:           batchIds.length,
      total_incidents:         productionOrders.flatMap(o => o.batches).flatMap(b => b.incidents).length,
      reservations_count:      reservations.length,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MATERIAL TRACEABILITY — which batches used a specific material
// ─────────────────────────────────────────────────────────────────────────────

async function getMaterialTrace(materialId) {
  const material = await RawMaterial.findByPk(materialId);
  if (!material) throw new Error('Material not found');

  // All batches that used this material
  const usages = await BatchMaterial.findAll({
    where: { material_id: materialId },
    include: [{
      model: Batch, as: 'batch',
      include: [
        {
          model: ProductionOrder, as: 'production_order',
          include: [{ model: Product, as: 'product', attributes: ['name', 'reference'] }],
        },
        { model: Incident, as: 'incidents', attributes: ['incident_id', 'title', 'severity', 'status'] },
      ],
    }],
  });

  // Stock movements for this material from MongoDB
  const movements = await StockMovement
    .find({ product_id: Number(materialId) })
    .sort({ performed_at: -1 })
    .limit(50);

  return {
    material,
    used_in_batches: usages,
    stock_movements: movements,
    summary: {
      batches_count:    usages.length,
      incidents_linked: usages.flatMap(u => u.batch?.incidents || []).length,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTIVE DASHBOARD — admin KPIs across all services
// ─────────────────────────────────────────────────────────────────────────────

async function getDashboard() {
  const [
    totalBatches,
    batchesByStatus,
    openIncidents,
    criticalIncidents,
    recentIncidents,
    recentBatchLogs,
  ] = await Promise.all([
    Batch.count(),
    Batch.findAll({
      attributes: [
        'status',
        [require('../config/postgres.config').fn('COUNT', require('../config/postgres.config').col('batch_id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    }),
    Incident.count({ where: { status: 'open' } }),
    Incident.count({ where: { severity: 'critical', status: ['open', 'investigating'] } }),
    Incident.findAll({
      where: { status: ['open', 'investigating'] },
      include: [
        {
          model: Batch, as: 'batch',
          include: [{ model: ProductionOrder, as: 'production_order', include: [{ model: Product, as: 'product', attributes: ['name'] }] }],
        },
        { model: User, as: 'reporter', attributes: ['first_name', 'last_name'] },
      ],
      order: [['detected_at', 'DESC']],
      limit: 10,
    }),
    BatchActionLog.find({}).sort({ timestamp: -1 }).limit(20),
  ]);

  return {
    kpis: {
      total_batches:       totalBatches,
      open_incidents:      openIncidents,
      critical_incidents:  criticalIncidents,
    },
    batches_by_status:  batchesByStatus,
    recent_incidents:   recentIncidents,
    recent_batch_events: recentBatchLogs,
  };
}

module.exports = {
  getBatchTrace,
  getIncidentTrace,
  getOrderTrace,
  getMaterialTrace,
  getDashboard,
};