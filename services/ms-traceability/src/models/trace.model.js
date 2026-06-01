const { DataTypes } = require('sequelize');
const sequelize = require('../config/postgres.config');

// ── Read-only models — traceability never writes to these ─────

const Batch = sequelize.define('Batch', {
  batch_id:            { type: DataTypes.INTEGER, primaryKey: true },
  production_order_id: { type: DataTypes.INTEGER },
  operator_id:         { type: DataTypes.INTEGER },
  batch_number:        { type: DataTypes.STRING(100) },
  manufacturing_date:  { type: DataTypes.DATE },
  expiration_date:     { type: DataTypes.DATE },
  status:              { type: DataTypes.STRING(50) },
  quantity_produced:   { type: DataTypes.INTEGER },
  notes:               { type: DataTypes.TEXT },
}, { tableName: 'batch', timestamps: false });

const ProductionOrder = sequelize.define('ProductionOrder', {
  production_order_id: { type: DataTypes.INTEGER, primaryKey: true },
  product_id:          { type: DataTypes.INTEGER },
  customer_order_id:   { type: DataTypes.INTEGER },
  site_id:             { type: DataTypes.INTEGER },
  created_by:          { type: DataTypes.INTEGER },
  order_number:        { type: DataTypes.STRING(100) },
  creation_date:       { type: DataTypes.DATE },
  planned_start:       { type: DataTypes.DATE },
  planned_end:         { type: DataTypes.DATE },
  status:              { type: DataTypes.STRING(50) },
  priority:            { type: DataTypes.STRING(50) },
  quantity_ordered:    { type: DataTypes.INTEGER },
}, { tableName: 'production_order', timestamps: false });

const Incident = sequelize.define('Incident', {
  incident_id:  { type: DataTypes.INTEGER, primaryKey: true },
  batch_id:     { type: DataTypes.INTEGER },
  reported_by:  { type: DataTypes.INTEGER },
  title:        { type: DataTypes.STRING(255) },
  description:  { type: DataTypes.TEXT },
  severity:     { type: DataTypes.STRING(50) },
  detected_at:  { type: DataTypes.DATE },
  resolved_at:  { type: DataTypes.DATE },
  status:       { type: DataTypes.STRING(50) },
}, { tableName: 'incident', timestamps: false });

const Product = sequelize.define('Product', {
  product_id:  { type: DataTypes.INTEGER, primaryKey: true },
  reference:   { type: DataTypes.STRING(100) },
  name:        { type: DataTypes.STRING(255) },
  description: { type: DataTypes.TEXT },
  unit_price:  { type: DataTypes.DECIMAL(12, 2) },
  status:      { type: DataTypes.STRING(50) },
}, { tableName: 'product', timestamps: false });

const Site = sequelize.define('Site', {
  site_id: { type: DataTypes.INTEGER, primaryKey: true },
  name:    { type: DataTypes.STRING(100) },
  country: { type: DataTypes.STRING(100) },
}, { tableName: 'site', timestamps: false });

const User = sequelize.define('User', {
  user_id:    { type: DataTypes.INTEGER, primaryKey: true },
  first_name: { type: DataTypes.STRING(100) },
  last_name:  { type: DataTypes.STRING(100) },
  email:      { type: DataTypes.STRING(255) },
}, { tableName: 'user', timestamps: false });

const RawMaterial = sequelize.define('RawMaterial', {
  material_id:    { type: DataTypes.INTEGER, primaryKey: true },
  reference:      { type: DataTypes.STRING(100) },
  name:           { type: DataTypes.STRING(255) },
  unit:           { type: DataTypes.STRING(20) },
}, { tableName: 'raw_material', timestamps: false });

const BatchMaterial = sequelize.define('BatchMaterial', {
  batch_id:      { type: DataTypes.INTEGER, primaryKey: true },
  material_id:   { type: DataTypes.INTEGER, primaryKey: true },
  quantity_used: { type: DataTypes.DECIMAL(12, 3) },
  lot_number:    { type: DataTypes.STRING(100) },
}, { tableName: 'batch_material', timestamps: false });

const MaterialReservation = sequelize.define('MaterialReservation', {
  reservation_id:      { type: DataTypes.INTEGER, primaryKey: true },
  production_order_id: { type: DataTypes.INTEGER },
  material_id:         { type: DataTypes.INTEGER },
  quantity_reserved:   { type: DataTypes.DECIMAL(12, 3) },
  reserved_at:         { type: DataTypes.DATE },
  released_at:         { type: DataTypes.DATE },
  is_active:           { type: DataTypes.BOOLEAN },
}, { tableName: 'material_reservation', timestamps: false });

// ── Associations ──────────────────────────────────────────────
Batch.belongsTo(ProductionOrder, { foreignKey: 'production_order_id', as: 'production_order' });
Batch.belongsTo(User,            { foreignKey: 'operator_id',          as: 'operator' });
Batch.hasMany(Incident,          { foreignKey: 'batch_id',             as: 'incidents' });

ProductionOrder.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
ProductionOrder.belongsTo(Site,    { foreignKey: 'site_id',    as: 'site' });
ProductionOrder.belongsTo(User,    { foreignKey: 'created_by', as: 'creator' });
ProductionOrder.hasMany(Batch,     { foreignKey: 'production_order_id', as: 'batches' });

Incident.belongsTo(Batch, { foreignKey: 'batch_id',    as: 'batch' });
Incident.belongsTo(User,  { foreignKey: 'reported_by', as: 'reporter' });

BatchMaterial.belongsTo(RawMaterial, { foreignKey: 'material_id', as: 'material' });
MaterialReservation.belongsTo(RawMaterial, { foreignKey: 'material_id', as: 'material' });

module.exports = {
  Batch, ProductionOrder, Incident,
  Product, Site, User,
  RawMaterial, BatchMaterial, MaterialReservation,
};