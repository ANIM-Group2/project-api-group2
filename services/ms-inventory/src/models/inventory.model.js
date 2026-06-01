const { DataTypes } = require('sequelize');
const sequelize = require('../config/postgres.config');

// Maps to your `raw_material` table
const RawMaterial = sequelize.define('RawMaterial', {
  material_id:       { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  supplier_id:       { type: DataTypes.INTEGER, allowNull: true },
  reference:         { type: DataTypes.STRING(100), unique: true },
  name:              { type: DataTypes.STRING(255) },
  stock_quantity:    { type: DataTypes.DECIMAL(12, 3), defaultValue: 0 },
  reserved_quantity: { type: DataTypes.DECIMAL(12, 3), defaultValue: 0 },
  safety_threshold:  { type: DataTypes.DECIMAL(12, 3), defaultValue: 0 },
  unit:              { type: DataTypes.STRING(20) },
}, { tableName: 'raw_material', timestamps: false });

// Maps to your `supplier` table
const Supplier = sequelize.define('Supplier', {
  supplier_id:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  company_name: { type: DataTypes.STRING(255) },
  email:        { type: DataTypes.STRING(255) },
  country:      { type: DataTypes.STRING(100) },
}, { tableName: 'supplier', timestamps: false });

// Maps to your `material_reservation` table
const MaterialReservation = sequelize.define('MaterialReservation', {
  reservation_id:     { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  production_order_id:{ type: DataTypes.INTEGER },
  material_id:        { type: DataTypes.INTEGER },
  quantity_reserved:  { type: DataTypes.DECIMAL(12, 3) },
  reserved_at:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  released_at:        { type: DataTypes.DATE, allowNull: true },
  is_active:          { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'material_reservation', timestamps: false });

RawMaterial.belongsTo(Supplier,          { foreignKey: 'supplier_id',  as: 'supplier' });
MaterialReservation.belongsTo(RawMaterial,{ foreignKey: 'material_id',  as: 'material' });

module.exports = { RawMaterial, Supplier, MaterialReservation };