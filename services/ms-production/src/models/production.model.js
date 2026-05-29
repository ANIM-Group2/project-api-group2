const { DataTypes } = require('sequelize');
const sequelize = require('../config/postgres.config');

// ── production_order ─────────────────────────────────────────
const ProductionOrder = sequelize.define('ProductionOrder', {
  production_order_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product_id:          { type: DataTypes.INTEGER, allowNull: false },
  customer_order_id:   { type: DataTypes.INTEGER, allowNull: true },
  site_id:             { type: DataTypes.INTEGER, allowNull: false },
  created_by:          { type: DataTypes.INTEGER, allowNull: false },
  order_number:        { type: DataTypes.STRING(100), unique: true },
  creation_date:       { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  planned_start:       { type: DataTypes.DATE, allowNull: true },
  planned_end:         { type: DataTypes.DATE, allowNull: true },
  status:              { type: DataTypes.STRING(50), defaultValue: 'planned' },
  priority:            { type: DataTypes.STRING(50), defaultValue: 'normal' },
  quantity_ordered:    { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'production_order', timestamps: false });

// ── batch ─────────────────────────────────────────────────────
const Batch = sequelize.define('Batch', {
  batch_id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  production_order_id: { type: DataTypes.INTEGER, allowNull: false },
  operator_id:         { type: DataTypes.INTEGER, allowNull: true },
  batch_number:        { type: DataTypes.STRING(100), unique: true },
  manufacturing_date:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  expiration_date:     { type: DataTypes.DATE, allowNull: true },
  status:              { type: DataTypes.STRING(50), defaultValue: 'planned' },
  quantity_produced:   { type: DataTypes.INTEGER, defaultValue: 0 },
  notes:               { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'batch', timestamps: false });

// ── incident ──────────────────────────────────────────────────
const Incident = sequelize.define('Incident', {
  incident_id:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  batch_id:     { type: DataTypes.INTEGER, allowNull: false },
  reported_by:  { type: DataTypes.INTEGER, allowNull: false },
  title:        { type: DataTypes.STRING(255), allowNull: false },
  description:  { type: DataTypes.TEXT, allowNull: true },
  severity:     { type: DataTypes.STRING(50), defaultValue: 'medium' },
  detected_at:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  resolved_at:  { type: DataTypes.DATE, allowNull: true },
  status:       { type: DataTypes.STRING(50), defaultValue: 'open' },
}, { tableName: 'incident', timestamps: false });

// ── product (read-only join) ───────────────────────────────────
const Product = sequelize.define('Product', {
  product_id:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  reference:   { type: DataTypes.STRING(100) },
  name:        { type: DataTypes.STRING(255) },
  description: { type: DataTypes.TEXT },
  unit_price:  { type: DataTypes.DECIMAL(12, 2) },
  status:      { type: DataTypes.STRING(50) },
}, { tableName: 'product', timestamps: false });

// ── site (read-only join) ─────────────────────────────────────
const Site = sequelize.define('Site', {
  site_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:    { type: DataTypes.STRING(100) },
  country: { type: DataTypes.STRING(100) },
}, { tableName: 'site', timestamps: false });

// ── user (read-only join) ─────────────────────────────────────
const User = sequelize.define('User', {
  user_id:    { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  first_name: { type: DataTypes.STRING(100) },
  last_name:  { type: DataTypes.STRING(100) },
  email:      { type: DataTypes.STRING(255) },
}, { tableName: 'user', timestamps: false });

// ── batch_material (traceability) ────────────────────────────
const BatchMaterial = sequelize.define('BatchMaterial', {
  batch_id:     { type: DataTypes.INTEGER, primaryKey: true },
  material_id:  { type: DataTypes.INTEGER, primaryKey: true },
  quantity_used:{ type: DataTypes.DECIMAL(12, 3) },
  lot_number:   { type: DataTypes.STRING(100), allowNull: true },
}, { tableName: 'batch_material', timestamps: false });

// ── Associations ──────────────────────────────────────────────
ProductionOrder.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
ProductionOrder.belongsTo(Site,    { foreignKey: 'site_id',    as: 'site' });
ProductionOrder.belongsTo(User,    { foreignKey: 'created_by', as: 'creator' });
ProductionOrder.hasMany(Batch,     { foreignKey: 'production_order_id', as: 'batches' });

Batch.belongsTo(ProductionOrder, { foreignKey: 'production_order_id', as: 'production_order' });
Batch.belongsTo(User,            { foreignKey: 'operator_id', as: 'operator' });
Batch.hasMany(Incident,          { foreignKey: 'batch_id', as: 'incidents' });

Incident.belongsTo(Batch, { foreignKey: 'batch_id',    as: 'batch' });
Incident.belongsTo(User,  { foreignKey: 'reported_by', as: 'reporter' });

module.exports = { ProductionOrder, Batch, Incident, Product, Site, User, BatchMaterial };