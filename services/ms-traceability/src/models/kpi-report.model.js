const mongoose = require('mongoose');

const kpiReportSchema = new mongoose.Schema({
  report_type:   { type: String, required: true },
  generated_at:  { type: Date, default: Date.now },
  generated_by:  { type: Number },
  period:        { type: String },
  kpis:          { type: mongoose.Schema.Types.Mixed },
  top_customers: { type: Array },
  orders_by_status: { type: Array },
}, { collection: 'kpi_reports' });

module.exports = mongoose.model('KpiReport', kpiReportSchema);