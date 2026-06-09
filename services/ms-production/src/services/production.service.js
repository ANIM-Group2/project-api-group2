const { ProductionOrder, Product, Site, User, Batch } = require('../models/production.model');

async function getAllOrders(filters = {}) {
  const where = {};
  if (filters.status)  where.status  = filters.status;
  if (filters.site_id) where.site_id = filters.site_id;
  if (filters.priority) where.priority = filters.priority;

  return ProductionOrder.findAll({
    where,
    include: [
      { model: Product, as: 'product', attributes: ['name', 'reference', 'unit_price'] },
      { model: Site,    as: 'site',    attributes: ['name', 'country'] },
      { model: User,    as: 'creator', attributes: ['first_name', 'last_name', 'email'] },
    ],
    order: [['creation_date', 'DESC']],
  });
}

async function getOrderById(id) {
  const order = await ProductionOrder.findByPk(id, {
    include: [
      { model: Product, as: 'product' },
      { model: Site,    as: 'site' },
      { model: User,    as: 'creator' },
      { model: Batch,   as: 'batches' },
    ],
  });
  if (!order) throw new Error('Production order not found');
  return order;
}

async function createOrder(data) {
  const { product_id, site_id, created_by, order_number, planned_start, planned_end, priority, quantity_ordered, customer_order_id } = data;
  // Auto-generate order_number if not provided
  const finalOrderNumber = order_number || `OF-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  if (!product_id || !site_id || !created_by || !quantity_ordered)
    throw new Error('Missing required fields: product_id, site_id, created_by, quantity_ordered');

  const created = await ProductionOrder.create({
    product_id, site_id, created_by, order_number: finalOrderNumber,
    planned_start, planned_end,
    priority:         priority || 'normal',
    quantity_ordered,
    customer_order_id: customer_order_id || null,
    status: 'planned',
  });
  return getOrderById(created.production_order_id);
}

async function updateOrderStatus(id, status) {
  const order = await ProductionOrder.findByPk(id);
  if (!order) throw new Error('Production order not found');
  await order.update({ status });
  return order;
}

async function getKPIs() {
  const { Op } = require('sequelize');

  const [active, completed, critical, total, batches, delayedOrders] = await Promise.all([
    ProductionOrder.count({ where: { status: 'in_progress' } }),
    ProductionOrder.count({ where: { status: 'completed' } }),
    ProductionOrder.count({ where: { priority: 'critical', status: ['planned', 'in_progress'] } }),
    ProductionOrder.count(),
    Batch.findAll({
      attributes: ['quantity_produced', 'status'],
      include: [{ model: ProductionOrder, as: 'production_order', attributes: ['quantity_ordered'] }],
      raw: true,
      nest: true,
    }),
    // Delayed: in_progress orders where planned_end has passed
    ProductionOrder.count({
      where: {
        status: 'in_progress',
        planned_end: { [Op.lt]: new Date() },
      }
    }),
  ]);

  // Yield rate: avg(quantity_produced / quantity_ordered) for completed batches
  const doneBatches = batches.filter(b => b.status === 'completed' && b.production_order?.quantity_ordered > 0);
  const yieldRate = doneBatches.length > 0
    ? Math.round(doneBatches.reduce((sum, b) => sum + (b.quantity_produced / b.production_order.quantity_ordered), 0) / doneBatches.length * 100)
    : 0;

  // Completion rate: completed orders / total
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const delayRate = active > 0 ? Math.round((delayedOrders / active) * 100) : 0;

  return {
    active_orders:    active,
    completed_orders: completed,
    critical_orders:  critical,
    total_orders:     total,
    yield_rate:       yieldRate,
    completion_rate:  completionRate,
    delayed_orders:   delayedOrders,
    delay_rate:       delayRate,
  };
}

module.exports = { getAllOrders, getOrderById, createOrder, updateOrderStatus, getKPIs };