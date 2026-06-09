// const svc = require('../services/incident.service');

// // GET /production/incidents
// const getAllIncidents = async (req, res) => {
//   try {
//     res.json(await svc.getAllIncidents(req.query));
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };

// // GET /production/incidents/stats
// const getIncidentStats = async (req, res) => {
//   try {
//     res.json(await svc.getIncidentStats());
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };

// // GET /production/incidents/:id
// const getIncidentById = async (req, res) => {
//   try {
//     res.json(await svc.getIncidentById(req.params.id));
//   } catch (e) {
//     const status = e.message.includes('not found') ? 404 : 500;
//     res.status(status).json({ error: e.message });
//   }
// };

// // POST /production/incidents
// const createIncident = async (req, res) => {
//   try {
//     const reportedBy = req.body.reported_by || req.headers['x-user-id'];
//     const data       = { ...req.body, reported_by: reportedBy };
//     res.status(201).json(await svc.createIncident(data));
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// };

// // PATCH /production/incidents/:id/status
// const updateIncidentStatus = async (req, res) => {
//   try {
//     const { status, resolution } = req.body;
//     if (!status) return res.status(400).json({ error: 'status is required' });
//     res.json(await svc.updateIncidentStatus(req.params.id, status, resolution));
//   } catch (e) {
//     const status = e.message.includes('not found') ? 404 : 400;
//     res.status(status).json({ error: e.message });
//   }
// };

// module.exports = {
//   getAllIncidents, getIncidentStats, getIncidentById,
//   createIncident, updateIncidentStatus,
// };


const tracer = require('../services/traceability.client');
const svc = require('../services/incident.service');

// GET /production/incidents
const getAllIncidents = async (req, res) => {
  try {
    res.json(await svc.getAllIncidents(req.query));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /production/incidents/stats
const getIncidentStats = async (req, res) => {
  try {
    res.json(await svc.getIncidentStats());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /production/incidents/:id
const getIncidentById = async (req, res) => {
  try {
    res.json(await svc.getIncidentById(req.params.id));
  } catch (e) {
    const status = e.message.includes('not found') ? 404 : 500;
    res.status(status).json({ error: e.message });
  }
};

// POST /production/incidents
const createIncident = async (req, res) => {
  try {
    const reportedBy = req.body.reported_by || req.headers['x-user-id'];
    const data       = { ...req.body, reported_by: reportedBy };
    const incident   = await svc.createIncident(data);
    // Inter-service: notify traceability
    const token = req.headers['authorization']?.split(' ')[1];
    tracer.logEvent('incident_reported', {
      incident_id:  incident.incident_id,
      batch_id:     incident.batch_id,
      batch_number: incident.batch?.batch_number,
      severity:     incident.severity,
      title:        incident.title,
      reported_by:  reportedBy,
      actor_name:   `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || req.headers['x-user-name'] || `#${reportedBy}`,
    }, token);
    res.status(201).json(incident);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// PATCH /production/incidents/:id/status
const updateIncidentStatus = async (req, res) => {
  try {
    const { status, resolution } = req.body;
    if (!status) return res.status(400).json({ error: 'status is required' });
    res.json(await svc.updateIncidentStatus(req.params.id, status, resolution));
  } catch (e) {
    const status = e.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: e.message });
  }
};

module.exports = {
  getAllIncidents, getIncidentStats, getIncidentById,
  createIncident, updateIncidentStatus,
};