const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database.config');

// ── Customer ──────────────────────────────────────────────────
const Customer = sequelize.define('Customer', {
  customer_id:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  company_name: { type: DataTypes.STRING(200) },
  contact_name: { type: DataTypes.STRING(200) },
  email:        { type: DataTypes.STRING(255) },
  phone:        { type: DataTypes.STRING(50) },
  country:      { type: DataTypes.STRING(100) },
  status:       { type: DataTypes.STRING(20), defaultValue: 'active' },
}, { tableName: 'customer', timestamps: false });

// ── CustomerOrder — real table name is customer_order ─────────
const Order = sequelize.define('Order', {
  customer_order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id:       { type: DataTypes.INTEGER },
  order_date:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  expected_delivery: { type: DataTypes.DATEONLY },
  status:            { type: DataTypes.STRING(50), defaultValue: 'draft' },
  total_amount:      { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  is_urgent:         { type: DataTypes.BOOLEAN, defaultValue: false },
  validated_by:      { type: DataTypes.INTEGER },
  created_at:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName:  'customer_order',
  timestamps: false,
});

// ── OrderLine — real table name is order_line ─────────────────
const OrderItem = sequelize.define('OrderItem', {
  order_line_id:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_order_id: { type: DataTypes.INTEGER },
  product_id:        { type: DataTypes.INTEGER },
  quantity:          { type: DataTypes.INTEGER },
  unit_price:        { type: DataTypes.DECIMAL(12, 2) },
}, { tableName: 'order_line', timestamps: false });

// ── Shipment ──────────────────────────────────────────────────
const Shipment = sequelize.define('Shipment', {
  shipment_id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_order_id: { type: DataTypes.INTEGER },
  site_id:           { type: DataTypes.INTEGER },
  shipment_date:     { type: DataTypes.DATEONLY },
  shipment_type:     { type: DataTypes.STRING(50) },
  tracking_number:   { type: DataTypes.STRING(100) },
  status:            { type: DataTypes.STRING(50), defaultValue: 'planned' },
}, { tableName: 'shipment', timestamps: false });

// ── Associations ──────────────────────────────────────────────
Order.belongsTo(Customer, { foreignKey: 'customer_id',       as: 'customer' });
Customer.hasMany(Order,   { foreignKey: 'customer_id',       as: 'orders' });
Order.hasMany(OrderItem,  { foreignKey: 'customer_order_id', as: 'items' });
Order.hasMany(Shipment,   { foreignKey: 'customer_order_id', as: 'shipments' });
Shipment.belongsTo(Order, { foreignKey: 'customer_order_id', as: 'order' });

module.exports = { Order, OrderItem, Customer, Shipment };