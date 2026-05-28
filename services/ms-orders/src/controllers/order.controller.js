const svc = require('../services/order.service');

const getOrders          = async (req, res) => { try { res.json(await svc.getOrders(req.query)); } catch (e) { res.status(500).json({ error: e.message }); }};
const getOrder           = async (req, res) => { try { res.json(await svc.getOrderById(req.params.id)); } catch (e) { res.status(404).json({ error: e.message }); }};
const createOrder        = async (req, res) => { try { res.status(201).json(await svc.createOrder({ ...req.body, sales_user_id: req.headers['x-user-id'] })); } catch (e) { res.status(400).json({ error: e.message }); }};
const updateOrderStatus  = async (req, res) => { try { res.json(await svc.updateOrderStatus(req.params.id, req.body.status, req.body.notes)); } catch (e) { res.status(400).json({ error: e.message }); }};
const getCustomers       = async (req, res) => { try { res.json(await svc.getCustomers()); } catch (e) { res.status(500).json({ error: e.message }); }};
const createShipment     = async (req, res) => { try { res.status(201).json(await svc.createShipment({ ...req.body, logistics_user: req.headers['x-user-id'] })); } catch (e) { res.status(400).json({ error: e.message }); }};
const updateShipment     = async (req, res) => { try { res.json(await svc.updateShipmentStatus(req.params.id, req.body.status)); } catch (e) { res.status(400).json({ error: e.message }); }};

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus, getCustomers, createShipment, updateShipment };