require('dotenv').config();
const { connectMongo } = require('../config/mongo.config');
const { StockMovement, StockAlert } = require('../models/stock-log.model');

async function runMongoSeed() {
  await connectMongo();

  await StockMovement.deleteMany({});
  await StockAlert.deleteMany({});

  // Historical stock movements
  await StockMovement.insertMany([
    { product_id: 1, product_ref: 'AW-CF-001', site_id: 1, movement_type: 'in',  quantity: 500, previous_qty: 0,   new_qty: 500, reason: 'Initial stock', performed_by: 4 },
    { product_id: 1, product_ref: 'AW-CF-001', site_id: 1, movement_type: 'out', quantity: 100, previous_qty: 500, new_qty: 400, reason: 'Batch BATCH-2025-001', reference_doc: 'BATCH-2025-001', performed_by: 1 },
    { product_id: 1, product_ref: 'AW-CF-001', site_id: 1, movement_type: 'out', quantity: 50,  previous_qty: 400, new_qty: 350, reason: 'Order ORD-2025-001', reference_doc: 'ORD-2025-001', performed_by: 2 },
    { product_id: 7, product_ref: 'AW-CF-007', site_id: 1, movement_type: 'in',  quantity: 20,  previous_qty: 0,   new_qty: 20,  reason: 'Initial stock', performed_by: 4 },
    { product_id: 7, product_ref: 'AW-CF-007', site_id: 1, movement_type: 'out', quantity: 12,  previous_qty: 20,  new_qty: 8,   reason: 'Batch BATCH-2025-004', reference_doc: 'BATCH-2025-004', performed_by: 1 },
    { product_id: 3, product_ref: 'AW-HY-003', site_id: 1, movement_type: 'in',  quantity: 80,  previous_qty: 0,   new_qty: 80,  reason: 'Supplier delivery', performed_by: 2 },
    { product_id: 3, product_ref: 'AW-HY-003', site_id: 1, movement_type: 'out', quantity: 50,  previous_qty: 80,  new_qty: 30,  reason: 'Batch BATCH-2025-003', reference_doc: 'BATCH-2025-003', performed_by: 5 },
  ]);

  // Active low-stock alerts
  await StockAlert.insertMany([
    { product_id: 7, product_ref: 'AW-CF-007', site_id: 1, alert_type: 'low_stock',    current_qty: 8,   threshold: 2,  status: 'active' },
    { product_id: 3, product_ref: 'AW-HY-003', site_id: 1, alert_type: 'low_stock',    current_qty: 30,  threshold: 5,  status: 'active' },
    { product_id: 4, product_ref: 'AW-AV-004', site_id: 2, alert_type: 'low_stock',    current_qty: 85,  threshold: 10, status: 'acknowledged' },
  ]);

  console.log('✅ MongoDB inventory seed completed');
  process.exit(0);
}

runMongoSeed().catch(err => { console.error(err); process.exit(1); });