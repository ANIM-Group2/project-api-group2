const sequelize = require('../config/database.config');
const { Order, OrderItem, Customer, Shipment } = require('../models/order.model');

// ── Orders ────────────────────────────────────────────────────

async function getAllOrders(filters = {}) {
  const where = {};
  if (filters.status)      where.status      = filters.status;
  if (filters.customer_id) where.customer_id = filters.customer_id;
  if (filters.urgent === 'true') where.is_urgent = true;

  return Order.findAll({
    where,
    include: [{ model: Customer, as: 'customer', attributes: ['company_name', 'country'] }],
    order: [['created_at', 'DESC']],
  });
}

async function getOrderById(id) {
  const order = await Order.findByPk(id, {
    include: [
      { model: Customer,  as: 'customer' },
      { model: OrderItem, as: 'items' },
      { model: Shipment,  as: 'shipments' },
    ],
  });
  if (!order) throw new Error('Order not found');
  return order;
}

async function createOrder({ customer_id, expected_delivery, is_urgent, total_amount, created_by }) {
  if (!customer_id) throw new Error('customer_id is required');
  return Order.create({
    customer_id,
    expected_delivery,
    is_urgent:    is_urgent || false,
    total_amount: total_amount || 0,
    validated_by: created_by,
    status:       'draft',
  });
}

async function approveOrder(id, { notes, approved_by }) {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');
  await order.update({ status: 'confirmed', validated_by: approved_by });
  return order;
}

async function updateOrderStatus(id, status) {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');
  await order.update({ status });
  return order;
}

// ── Customers ─────────────────────────────────────────────────

async function getAllCustomers() {
  return Customer.findAll({
    include: [{
      model: Order, as: 'orders',
      attributes: ['customer_order_id', 'total_amount', 'status', 'created_at'],
    }],
    order: [['company_name', 'ASC']],
  });
}

// ── Stats ─────────────────────────────────────────────────────

async function getSalesStats() {
  const [revenue, statusCounts, topCustomers] = await Promise.all([
    sequelize.query(`
      SELECT
        COALESCE(SUM(total_amount) FILTER (WHERE created_at >= date_trunc('year',  NOW())), 0) AS revenue_ytd,
        COALESCE(SUM(total_amount) FILTER (WHERE created_at >= date_trunc('month', NOW())), 0) AS revenue_mtd,
        COUNT(*) FILTER (WHERE status = 'draft')          AS pending_orders,
        COUNT(*) FILTER (WHERE status = 'confirmed')      AS active_orders,
        COUNT(*) FILTER (WHERE is_urgent = true AND status NOT IN ('delivered','cancelled')) AS urgent_orders
      FROM customer_order
    `, { type: sequelize.QueryTypes.SELECT }),

    sequelize.query(`
      SELECT status, COUNT(*) AS count FROM customer_order GROUP BY status
    `, { type: sequelize.QueryTypes.SELECT }),

    sequelize.query(`
      SELECT c.company_name,
             COUNT(co.customer_order_id) AS order_count,
             COALESCE(SUM(co.total_amount), 0) AS revenue
      FROM customer c
      JOIN customer_order co ON c.customer_id = co.customer_id
      GROUP BY c.customer_id, c.company_name
      ORDER BY revenue DESC
      LIMIT 5
    `, { type: sequelize.QueryTypes.SELECT }),
  ]);

  return {
    ...revenue[0],
    orders_by_status: statusCounts,
    top_customers:    topCustomers,
  };
}

// ── Shipments ─────────────────────────────────────────────────

async function getAllShipments(filters = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;

  return Shipment.findAll({
    where,
    include: [{
      model: Order, as: 'order',
      attributes: ['customer_order_id', 'customer_id'],
      include: [{ model: Customer, as: 'customer', attributes: ['company_name'] }],
    }],
    order: [['created_at', 'DESC']],
  });
}

async function createShipment({ customer_order_id, site_id, shipment_type, tracking_number, shipment_date }) {
  if (!customer_order_id) throw new Error('customer_order_id is required');
  return Shipment.create({
    customer_order_id,
    site_id: site_id || 1,
    shipment_type: shipment_type || 'ground',
    tracking_number,
    shipment_date:  shipment_date || new Date().toISOString().split('T')[0],
    status: 'planned',
  });
}

async function updateShipmentStatus(id, status) {
  const shipment = await Shipment.findByPk(id);
  if (!shipment) throw new Error('Shipment not found');
  const update = { status };
  if (status === 'delivered') update.delivered_at = new Date();
  await shipment.update(update);
  return shipment;
}

module.exports = {
  getAllOrders, getOrderById, createOrder, approveOrder, updateOrderStatus,
  getAllCustomers, getSalesStats,
  getAllShipments, createShipment, updateShipmentStatus,
};