const { Incident, Batch, ProductionOrder, Product, Site, User } = require('../models/production.model');
const { IncidentLog, BatchActionLog } = require('../models/action-log.model');

async function getAllIncidents(filters = {}) {
  const where = {};
  if (filters.status)   where.status   = filters.status;
  if (filters.severity) where.severity = filters.severity;

  return Incident.findAll({
    where,
    include: [
      {
        model: Batch, as: 'batch',
        include: [{
          model: ProductionOrder, as: 'production_order',
          include: [
            { model: Product, as: 'product', attributes: ['name', 'reference'] },
            { model: Site,    as: 'site',    attributes: ['name'] },
          ],
        }],
      },
      { model: User, as: 'reporter', attributes: ['first_name', 'last_name', 'email'] },
    ],
    order: [['detected_at', 'DESC']],
  });
}

async function getIncidentById(id) {
  const incident = await Incident.findByPk(id, {
    include: [
      {
        model: Batch, as: 'batch',
        include: [{ model: ProductionOrder, as: 'production_order', include: [{ model: Product, as: 'product' }] }],
      },
      { model: User, as: 'reporter' },
    ],
  });
  if (!incident) throw new Error('Incident not found');
  return incident;
}

async function createIncident(data) {
  const { batch_id, reported_by, title, description, severity } = data;
  if (!batch_id || !reported_by || !title)
    throw new Error('Missing required fields: batch_id, reported_by, title');

  const incident = await Incident.create({
    batch_id, reported_by, title, description,
    severity: severity || 'medium',
    status: 'open',
  });

  // If high/critical → quarantine the batch
  if (severity === 'critical' || severity === 'high') {
    const batch = await Batch.findByPk(batch_id);
    if (batch) {
      await batch.update({ status: 'quarantined' });
      await BatchActionLog.create({
        batch_id,
        batch_number:    batch.batch_number,
        action:          'quarantined',
        previous_status: batch.status,
        new_status:      'quarantined',
        notes:           `Quarantined due to ${severity} incident: ${title}`,
      });
    }
  }

  // Log incident to MongoDB
  await IncidentLog.create({
    incident_id:  incident.incident_id,
    batch_id,
    action:       'created',
    severity,
    title,
    reported_by,
    new_status:   'open',
  });

  return incident;
}

async function updateIncidentStatus(id, status, resolution) {
  const incident = await Incident.findByPk(id);
  if (!incident) throw new Error('Incident not found');

  const updates = { status };
  if (status === 'resolved') updates.resolved_at = new Date();

  await incident.update(updates);

  await IncidentLog.create({
    incident_id:  incident.incident_id,
    batch_id:     incident.batch_id,
    action:       'status_updated',
    severity:     incident.severity,
    title:        incident.title,
    new_status:   status,
    notes:        resolution,
  });

  return incident;
}

async function getIncidentStats() {
  const [open, critical, investigating, resolved] = await Promise.all([
    Incident.count({ where: { status: 'open' } }),
    Incident.count({ where: { severity: 'critical', status: ['open', 'investigating'] } }),
    Incident.count({ where: { status: 'investigating' } }),
    Incident.count({ where: { status: 'resolved' } }),
  ]);

  return { open, critical, investigating, resolved };
}

module.exports = {
  getAllIncidents, getIncidentById,
  createIncident, updateIncidentStatus, getIncidentStats,
};