const mongoose = require('mongoose');

// Read from batch_action_logs collection (written by ms-production)
const BatchActionLog = mongoose.model('BatchActionLog', new mongoose.Schema({
  batch_id:        { type: Number, index: true },
  batch_number:    { type: String },
  action:          { type: String },
  previous_status: { type: String },
  new_status:      { type: String },
  operator_id:     { type: Number },
  notes:           { type: String },
  timestamp:       { type: Date, index: true },
}), 'batch_action_logs');

// Read from incident_logs collection (written by ms-production)
const IncidentLog = mongoose.model('IncidentLog', new mongoose.Schema({
  incident_id:  { type: Number, index: true },
  batch_id:     { type: Number, index: true },
  batch_number: { type: String },
  action:       { type: String },
  severity:     { type: String },
  title:        { type: String },
  reported_by:  { type: Number },
  new_status:   { type: String },
  timestamp:    { type: Date },
}), 'incident_logs');

// Read from stock_movements collection (written by ms-inventory)
const StockMovement = mongoose.model('StockMovement', new mongoose.Schema({
  product_id:    { type: Number },
  product_ref:   { type: String },
  site_id:       { type: Number },
  movement_type: { type: String },
  quantity:      { type: Number },
  previous_qty:  { type: Number },
  new_qty:       { type: Number },
  reason:        { type: String },
  reference_doc: { type: String },
  performed_by:  { type: Number },
  performed_at:  { type: Date },
}), 'stock_movements');

module.exports = { BatchActionLog, IncidentLog, StockMovement };