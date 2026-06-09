const mongoose = require('mongoose');

// Stock movement log — every stock change is recorded here
const stockMovementSchema = new mongoose.Schema({
  product_id:   { type: Number, required: true },
  product_ref:  { type: String, required: true },
  site_id:      { type: Number, required: true },
  movement_type:{ type: String, enum: ['in', 'out', 'entry', 'exit', 'adjustment', 'reservation', 'cancellation'], required: true },
  quantity:      { type: Number, required: true },
  previous_qty:  { type: Number },
  new_qty:       { type: Number },
  reason:        { type: String },
  reference_doc: { type: String }, // order number, batch number etc.
  performed_by:  { type: Number },  // user_id
  performed_at:  { type: Date, default: Date.now },
}, { collection: 'stock_movements' });

// Stock alert log — low stock / overstock events
const stockAlertSchema = new mongoose.Schema({
  product_id:  { type: Number, required: true },
  product_ref: { type: String },
  site_id:     { type: Number },
  alert_type:  { type: String, enum: ['low_stock', 'out_of_stock', 'overstock'], required: true },
  current_qty: { type: Number },
  threshold:   { type: Number },
  status:      { type: String, enum: ['active', 'acknowledged', 'resolved'], default: 'active' },
  created_at:  { type: Date, default: Date.now },
  resolved_at: { type: Date },
}, { collection: 'stock_alerts' });

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
const StockAlert    = mongoose.model('StockAlert',    stockAlertSchema);

module.exports = { StockMovement, StockAlert };