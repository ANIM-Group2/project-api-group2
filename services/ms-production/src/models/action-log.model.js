const mongoose = require('mongoose');

// Logs every action on batches and incidents — the traceability story
const BatchActionLogSchema = new mongoose.Schema({
  batch_id:     { type: Number, required: true, index: true },
  batch_number: { type: String },
  action:       { type: String, required: true }, // 'created', 'status_changed', 'incident_reported', 'completed'
  previous_status: { type: String },
  new_status:   { type: String },
  operator_id:  { type: Number },
  notes:        { type: String },
  timestamp:    { type: Date, default: Date.now, index: true },
});

const IncidentLogSchema = new mongoose.Schema({
  incident_id:  { type: Number, index: true },
  batch_id:     { type: Number, index: true },
  batch_number: { type: String },
  action:       { type: String }, // 'created', 'status_updated', 'resolved'
  severity:     { type: String },
  title:        { type: String },
  reported_by:  { type: Number },
  new_status:   { type: String },
  timestamp:    { type: Date, default: Date.now },
});

const BatchActionLog = mongoose.model('BatchActionLog', BatchActionLogSchema, 'batch_action_logs');
const IncidentLog    = mongoose.model('IncidentLog',    IncidentLogSchema,    'incident_logs');

module.exports = { BatchActionLog, IncidentLog };