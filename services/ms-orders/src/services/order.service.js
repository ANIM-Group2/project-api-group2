const { Op } = require('sequelize');
const sequelize = require('../config/database.config');
const { Order, OrderItem, Customer, Shipment } = require('../models/order.model');

// ── Orders ────────────────────────────────────────────────────────────────────

async function getAllOrders(filters = {}) {
  const where = {};
  if (filters.status)      where.status    = filters.status;
  if (filters.customer_id) where.customer_id = filters.customer_id;
  if (filters.is_urgent)   where.is_urgent = true;

  return Order.findAll({
    where,
    include: [{ model: Customer, as: 'customer', attributes: ['company_name', 'country'] }],
    order: [['created_at', 'DESC']],
  });
}

async function getOrderById(order_id) {
  const order = await Order.findByPk(order_id, {
    include: [
      { model: Customer,  as: 'customer' },
      { model: OrderItem, as: 'items' },
      { model: Shipment,  as: 'shipments' },
    ],
  });
  if (!order) throw new Error('Order not found');
  return order;
}

async function createOrder({ customer_id, delivery_date, is_urgent, notes, items, created_by }) {
  if (!customer_id || !items?.length) throw new Error('customer_id and items are required');

  const t = await sequelize.transaction();
  try {
    const count = await Order.count({ transaction: t });
    const order_ref = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const total_amount = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

    const order = await Order.create(
      { order_ref, customer_id, delivery_date, is_urgent: is_urgent || false, notes, total_amount, status: 'pending', created_by },
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      items.map(i => ({ order_id: order.order_id, product_id: i.product_id, quantity: i.quantity, unit_price: i.unit_price })),
      { transaction: t }
    );

    await t.commit();
    return order;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

async function approveOrder(order_id, { notes, approved_by }) {
  const order = await Order.findByPk(order_id);
  if (!order) throw new Error('Order not found');
  if (order.status !== 'pending') throw new Error(`Cannot approve order with status '${order.status}'`);

  await order.update({ status: 'approved', approved_by, approved_at: new Date(), approval_notes: notes });
  return order;
}

async function rejectOrder(order_id, { reason, approved_by }) {
  const order = await Order.findByPk(order_id);
  if (!order) throw new Error('Order not found');
  if (order.status !== 'pending') throw new Error(`Cannot reject order with status '${order.status}'`);

  await order.update({ status: 'rejected', approved_by, approved_at: new Date(), approval_notes: reason });
  return order;
}

async function updateOrderStatus(order_id, status) {
  const order = await Order.findByPk(order_id);
  if (!order) throw new Error('Order not found');
  await order.update({ status });
  return order;
}

// ── Customers ─────────────────────────────────────────────────────────────────

async function getAllCustomers() {
  return Customer.findAll({
    include: [{
      model: Order,
      as: 'orders',
      attributes: ['order_id', 'order_ref', 'total_amount', 'status', 'created_at'],
    }],
    order: [['company_name', 'ASC']],
  });
}

async function getCustomerById(customer_id) {
  const customer = await Customer.findByPk(customer_id, {
    include: [{ model: Order, as: 'orders', include: [{ model: OrderItem, as: 'items' }] }],
  });
  if (!customer) throw new Error('Customer not found');
  return customer;
}

// ── Sales stats ───────────────────────────────────────────────────────────────

async function getSalesStats() {
  const [revenue, statusCounts, topCustomers] = await Promise.all([
    sequelize.query(`
      SELECT
        COALESCE(SUM(total_amount) FILTER (WHERE created_at >= date_trunc('year', NOW())), 0)  AS revenue_ytd,
        COALESCE(SUM(total_amount) FILTER (WHERE created_at >= date_trunc('month', NOW())), 0) AS revenue_mtd,
        COUNT(*) FILTER (WHERE status = 'pending')    AS pending_orders,
        COUNT(*) FILTER (WHERE status = 'approved')   AS approved_orders,
        COUNT(*) FILTER (WHERE is_urgent = true AND status NOT IN ('delivered','cancelled')) AS urgent_orders
      FROM "order"
    `, { type: sequelize.QueryTypes.SELECT }),

    sequelize.query(`
      SELECT status, COUNT(*) AS count FROM "order" GROUP BY status
    `, { type: sequelize.QueryTypes.SELECT }),

    sequelize.query(`
      SELECT c.company_name,
             COUNT(o.order_id)    AS order_count,
             SUM(o.total_amount)  AS revenue
      FROM customer c
      JOIN "order" o ON c.customer_id = o.customer_id
      WHERE o.created_at >= date_trunc('year', NOW())
      GROUP BY c.customer_id, c.company_name
      ORDER BY revenue DESC
      LIMIT 5
    `, { type: sequelize.QueryTypes.SELECT }),
  ]);

  return {
    ...revenue[0],
    orders_by_status: statusCounts,
    top_customers: topCustomers,
  };
}

// ── Shipments ─────────────────────────────────────────────────────────────────

async function getAllShipments(filters = {}) {
  const where = {};
  if (filters.status)   where.status   = filters.status;
  if (filters.order_id) where.order_id = filters.order_id;

  return Shipment.findAll({
    where,
    include: [{ model: Order, as: 'order', attributes: ['order_ref', 'customer_id'] }],
    order: [['scheduled_date', 'ASC']],
  });
}

async function createShipment({ order_id, origin_site_id, destination_address, carrier, scheduled_date, notes, created_by }) {
  return Shipment.create({ order_id, origin_site_id, destination_address, carrier, scheduled_date, notes, status: 'scheduled', created_by });
}

async function updateShipmentStatus(shipment_id, status) {
  const shipment = await Shipment.findByPk(shipment_id);
  if (!shipment) throw new Error('Shipment not found');
  const update = { status };
  if (status === 'delivered') update.delivered_at = new Date();
  await shipment.update(update);
  return shipment;
}

module.exports = {
  getAllOrders, getOrderById, createOrder, approveOrder, rejectOrder, updateOrderStatus,
  getAllCustomers, getCustomerById, getSalesStats,
  getAllShipments, createShipment, updateShipmentStatus,
};