const { CustomerOrder } = require('../models/order.model');
const svc = require('../services/order.service');

const getOrders = async (req, res) => {
  try { res.json(await svc.getAllOrders(req.query)); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

const getOrder = async (req, res) => {
  try { res.json(await svc.getOrderById(req.params.id)); }
  catch (e) {
    const code = e.message.includes('not found') ? 404 : 500;
    res.status(code).json({ error: e.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const created_by = req.user.userId;
    res.status(201).json(await svc.createOrder({ ...req.body, created_by }));
  } catch (e) { res.status(400).json({ error: e.message }); }
};

const approveOrder = async (req, res) => {
  try {
    const approved_by = req.user.userId;
    res.json(await svc.approveOrder(req.params.id, { ...req.body, approved_by }));
  } catch (e) {
    const code = e.message.includes('not found') ? 404 : 400;
    res.status(code).json({ error: e.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    if (!req.body.status) return res.status(400).json({ error: 'status is required' });
    res.json(await svc.updateOrderStatus(req.params.id, req.body.status));
  } catch (e) {
    const code = e.message.includes('not found') ? 404 : 400;
    res.status(code).json({ error: e.message });
  }
};

const getCustomers = async (req, res) => {
  try { res.json(await svc.getAllCustomers()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

const getStats = async (req, res) => {
  try { res.json(await svc.getSalesStats()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

const getShipments = async (req, res) => {
  try { res.json(await svc.getAllShipments(req.query)); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

const createShipment = async (req, res) => {
  try {
    const created_by = req.user.userId;
    res.status(201).json(await svc.createShipment({ ...req.body, created_by }));
  } catch (e) { res.status(400).json({ error: e.message }); }
};

const updateShipment = async (req, res) => {
  try {
    if (!req.body.status) return res.status(400).json({ error: 'status is required' });
    res.json(await svc.updateShipmentStatus(req.params.id, req.body.status));
  } catch (e) {
    const code = e.message.includes('not found') ? 404 : 400;
    res.status(code).json({ error: e.message });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const { CustomerOrder } = require('../models/order.model');
    const order = await CustomerOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (['shipped', 'delivered'].includes(order.status))
      return res.status(409).json({ error: 'Cannot cancel a shipped or delivered order' });
    await order.update({ status: 'cancelled' });
    res.json(order);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const unapproveOrder = async (req, res) => {
  try {
    const { CustomerOrder } = require('../models/order.model');
    const order = await CustomerOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'confirmed')
      return res.status(409).json({ error: 'Only confirmed orders can be moved back to draft' });
    await order.update({ status: 'draft', validated_by: null });
    res.json(order);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const deleteOrder = async (req, res) => {
  try {
    const { CustomerOrder } = require('../models/order.model');
    const order = await CustomerOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!['draft', 'cancelled'].includes(order.status))
      return res.status(409).json({ error: 'Only draft or cancelled orders can be deleted' });
    await order.destroy();
    res.json({ deleted: true, id: Number(req.params.id) });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

module.exports = {
  getOrders, getOrder, createOrder, approveOrder, updateOrderStatus,
  cancelOrder, unapproveOrder, deleteOrder,
  getCustomers, getStats,
  getShipments, createShipment, updateShipment,
};