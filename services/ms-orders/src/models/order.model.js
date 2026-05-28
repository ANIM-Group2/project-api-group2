const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

// ── Customer ──────────────────────────────────────────────────────────────────
const Customer = sequelize.define('Customer', {
  customer_id:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  company_name: { type: DataTypes.STRING(200), allowNull: false },
  contact_name: { type: DataTypes.STRING(200) },
  email:        { type: DataTypes.STRING(255) },
  phone:        { type: DataTypes.STRING(50) },
  country:      { type: DataTypes.STRING(100) },
  status:       { type: DataTypes.STRING(20), defaultValue: 'active' },
}, { tableName: 'customer', timestamps: false });

// ── Order ─────────────────────────────────────────────────────────────────────
const Order = sequelize.define('Order', {
  order_id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_ref:     { type: DataTypes.STRING(50), unique: true, allowNull: false },
  customer_id:   { type: DataTypes.INTEGER },
  status:        { type: DataTypes.STRING(50), defaultValue: 'pending' },
  delivery_date: { type: DataTypes.DATEONLY },
  is_urgent:     { type: DataTypes.BOOLEAN, defaultValue: false },
  total_amount:  { type: DataTypes.DECIMAL(14, 2) },
  notes:         { type: DataTypes.TEXT },
  created_by:    { type: DataTypes.INTEGER },
  approved_by:   { type: DataTypes.INTEGER },
  approved_at:   { type: DataTypes.DATE },
  approval_notes:{ type: DataTypes.TEXT },
}, {
  tableName: 'order',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  quoteIdentifiers: true,
});

// ── OrderItem ─────────────────────────────────────────────────────────────────
const OrderItem = sequelize.define('OrderItem', {
  item_id:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id:   { type: DataTypes.INTEGER },
  product_id: { type: DataTypes.INTEGER },
  quantity:   { type: DataTypes.INTEGER, allowNull: false },
  unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
}, { tableName: 'order_item', timestamps: false });

// ── Shipment ──────────────────────────────────────────────────────────────────
const Shipment = sequelize.define('Shipment', {
  shipment_id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id:            { type: DataTypes.INTEGER },
  origin_site_id:      { type: DataTypes.INTEGER },
  destination_address: { type: DataTypes.TEXT },
  carrier:             { type: DataTypes.STRING(100) },
  tracking_number:     { type: DataTypes.STRING(100) },
  status:              { type: DataTypes.STRING(50), defaultValue: 'scheduled' },
  scheduled_date:      { type: DataTypes.DATEONLY },
  delivered_at:        { type: DataTypes.DATE },
  notes:               { type: DataTypes.TEXT },
  created_by:          { type: DataTypes.INTEGER },
}, {
  tableName: 'shipment',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// ── Associations ──────────────────────────────────────────────────────────────
Order.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasMany(Order,   { foreignKey: 'customer_id', as: 'orders' });

Order.hasMany(OrderItem,   { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Order.hasMany(Shipment,    { foreignKey: 'order_id', as: 'shipments' });
Shipment.belongsTo(Order,  { foreignKey: 'order_id', as: 'order' });

module.exports = { Order, OrderItem, Customer, Shipment };