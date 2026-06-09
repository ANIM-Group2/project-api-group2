const { Product } = require('../models/production.model');
const svc = require('../services/production.service');

// GET /production/orders
const getAllOrders = async (req, res) => {
  try {
    res.json(await svc.getAllOrders(req.query));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /production/orders/kpis
const getKPIs = async (req, res) => {
  try {
    res.json(await svc.getKPIs());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /production/orders/:id
const getOrderById = async (req, res) => {
  try {
    res.json(await svc.getOrderById(req.params.id));
  } catch (e) {
    const status = e.message.includes('not found') ? 404 : 500;
    res.status(status).json({ error: e.message });
  }
};

// POST /production/orders
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['name', 'ASC']] });
    res.json(products);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const createOrder = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const data   = { ...req.body, created_by: req.body.created_by || userId };
    res.status(201).json(await svc.createOrder(data));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// PATCH /production/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status is required' });
    res.json(await svc.updateOrderStatus(req.params.id, status));
  } catch (e) {
    const status = e.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: e.message });
  }
};

module.exports = { getAllOrders, getKPIs, getOrderById, createOrder, updateOrderStatus, getProducts };