const svc = require('../services/inventory.service');

const getStock    = async (req, res) => {
  try { res.json(await svc.getStock(req.query)); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

const getLowStock = async (req, res) => {
  try { res.json(await svc.getLowStock()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

const adjustStock = async (req, res) => {
  try {
    const { material_id, delta, reason, reference_doc } = req.body;
    if (!material_id || delta === undefined) 
      return res.status(400).json({ error: 'material_id and delta are required' });
    const userId = req.headers['x-user-id'];
    res.json(await svc.adjustStock(material_id, delta, reason, reference_doc, userId));
  } catch (e) { res.status(400).json({ error: e.message }); }
};

const getLog      = async (req, res) => {
  try { res.json(await svc.getMovementLog(req.query.material_id)); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

const getAlerts   = async (req, res) => {
  try { res.json(await svc.getAlerts(req.query.status)); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

const ackAlert    = async (req, res) => {
  try { res.json(await svc.acknowledgeAlert(req.params.id)); }
  catch (e) { res.status(400).json({ error: e.message }); }
};

const getReservations = async (req, res) => {
  try { res.json(await svc.getReservations()); }
  catch (e) { res.status(500).json({ error: e.message }); }
};

const createReservation = async (req, res) => {
  try {
    const { material_id, production_order_id, quantity } = req.body;
    if (!material_id || !production_order_id || !quantity)
      return res.status(400).json({ error: 'material_id, production_order_id and quantity required' });
    res.status(201).json(await svc.createReservation(material_id, production_order_id, quantity));
  } catch (e) { res.status(400).json({ error: e.message }); }
};

const releaseReservation = async (req, res) => {
  try { res.json(await svc.releaseReservation(req.params.id)); }
  catch (e) { res.status(400).json({ error: e.message }); }
};

module.exports = {
  getStock, getLowStock, adjustStock, getLog, getAlerts, ackAlert,
  getReservations, createReservation, releaseReservation,
};