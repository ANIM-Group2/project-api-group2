require('dotenv').config();
const sequelize = require('../config/database.config');
const { hashPassword } = require('../utils/bcrypt.util');

if (process.env.NODE_ENV === 'prod') {
  console.log('NODE_ENV=prod — seed disabled');
  process.exit(0);
}

async function runSeed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const { QueryInterface } = require('sequelize');
    const qi = sequelize.getQueryInterface();

    // ── Sites ─────────────────────────────────────────────
    await sequelize.query(`
      INSERT INTO site (name, address, country) VALUES
        ('Lyon site',      '12 Rue de l''Industrie, 69000 Lyon',    'France'),
        ('Toulouse site',  '45 Avenue Aéronautique, 31000 Toulouse', 'France')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Sites seeded');

    // ── Roles ─────────────────────────────────────────────
    await sequelize.query(`
      INSERT INTO role (role_name) VALUES
        ('operator'), ('logistics'), ('sales'), ('admin')
      ON CONFLICT (role_name) DO NOTHING
    `);
    console.log('✅ Roles seeded');

    // ── Users ─────────────────────────────────────────────
    const password = await hashPassword('password');
    await sequelize.query(`
      INSERT INTO "user" (role_id, site_id, first_name, last_name, email, password_hash, status) VALUES
        ((SELECT role_id FROM role WHERE role_name='operator'),  (SELECT site_id FROM site WHERE name='Toulouse site'), 'Karim',    'Aït-Ouali', 'karim@aeronexis.com',    '${password}', 'active'),
        ((SELECT role_id FROM role WHERE role_name='logistics'), (SELECT site_id FROM site WHERE name='Lyon site'),     'Claire',   'Dupont',    'claire@aeronexis.com',   '${password}', 'active'),
        ((SELECT role_id FROM role WHERE role_name='sales'),     (SELECT site_id FROM site WHERE name='Toulouse site'), 'Sophie',   'Martin',    'sophie@aeronexis.com',   '${password}', 'active'),
        ((SELECT role_id FROM role WHERE role_name='admin'),     (SELECT site_id FROM site WHERE name='Lyon site'),     'Philippe', 'Laurent',   'philippe@aeronexis.com', '${password}', 'active')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Users seeded');

    // ── Customers ─────────────────────────────────────────
    await sequelize.query(`
      INSERT INTO customer (company_name, contact_name, email, phone, country) VALUES
        ('Lufthansa Technik',       'Hans Mueller',      'ops@lufthansa-technik.de',   '+49 40 5070',     'Germany'),
        ('Air France Industries',   'Marie Lecomte',     'supply@airfrance-ind.fr',    '+33 1 41 56 78',  'France'),
        ('Boeing Supply Chain',     'James Anderson',    'supply@boeing.com',           '+1 206 655 2121', 'USA'),
        ('Safran Aircraft Engines', 'Luc Bertrand',      'procurement@safran.fr',       '+33 1 60 59 60',  'France'),
        ('Airbus Operations',       'Carlos Fernandez',  'ops@airbus.com',              '+33 5 61 93 33',  'France'),
        ('DroneTech Industries',    'Emma Williams',     'parts@dronetech.co.uk',       '+44 20 7946 0958','UK'),
        ('AeroSystems Canada',      'Michael Chen',      'procurement@aerosystems.ca',  '+1 514 555 0100', 'Canada'),
        ('Nordic Aviation Parts',   'Lars Eriksson',     'supply@nordic-aviation.se',   '+46 8 555 12 34', 'Sweden'),
        ('Iberia Maintenance',      'Pedro Sanchez',     'mro@iberia.es',               '+34 91 587 47 47','Spain'),
        ('Emirates Engineering',    'Ahmed Al-Rashid',   'engineering@emirates.com',    '+971 4 708 1111', 'UAE')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Customers seeded');

    // ── Suppliers ─────────────────────────────────────────
    await sequelize.query(`
      INSERT INTO supplier (company_name, contact_name, email, phone, country) VALUES
        ('MetalSupply France', 'Jean Dupont',   'supply@metalsupply.fr',   '+33 4 72 00 00', 'France'),
        ('ArcelorMittal',      'Pierre Martin', 'steel@arcelormittal.com', '+33 3 82 65 00', 'France'),
        ('TIMET Europe',       'Klaus Weber',   'orders@timet.eu',         '+49 211 77 77',  'Germany'),
        ('DuPont Polymers',    'Sarah Johnson', 'polymers@dupont.com',     '+1 302 774 1000','USA'),
        ('Eurocircuits',       'Jan De Smedt',  'orders@eurocircuits.com', '+32 14 60 09 00','Belgium'),
        ('RS Components',      'Tom Brown',     'orders@rs.com',           '+44 1536 444444', 'UK'),
        ('Lisi Aerospace',     'Paul Moreau',   'aerospace@lisi.fr',       '+33 4 77 92 12', 'France'),
        ('Shell Aviation',     'Emma Davis',    'aviation@shell.com',      '+44 207 934 1234','UK')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Suppliers seeded');

    // ── Products ──────────────────────────────────────────
    await sequelize.query(`
      INSERT INTO product (reference, name, description, unit_price, status) VALUES
        ('PROD-AX-2401', 'AX series hydraulic valve',          'High-precision hydraulic valve for civil aviation', 1250.00, 'active'),
        ('PROD-AX-2402', '3/4" high-pressure fitting',         'Stainless steel high-pressure fitting',              340.00, 'active'),
        ('PROD-MT-1105', 'Reinforced drive shaft',              'CNC-machined titanium drive shaft',                 2890.00, 'active'),
        ('PROD-MT-1106', 'CNC-machined aluminum housing',       'Precision aluminum housing for hydraulic systems',  1670.00, 'active'),
        ('PROD-EL-3301', 'Engine control module v2',            'DO-178C certified engine control module',           4200.00, 'active'),
        ('PROD-EL-3302', 'Differential pressure sensor',        'High-accuracy pressure sensor DO-160 certified',     890.00, 'active'),
        ('PROD-DR-5501', 'Long-range drone camera mount',       'CE certified drone camera mounting system',           560.00, 'active'),
        ('PROD-DR-5502', 'Battery mounting system',             'CE certified battery mounting system',                420.00, 'active'),
        ('PROD-ST-7801', 'High-temperature Viton O-ring',       'AMS certified Viton O-ring for aerospace use',         45.00, 'active'),
        ('PROD-ST-7802', 'M8x40 titanium screw aerospace grade','NAS certified aerospace grade titanium screw',          12.00, 'active')
      ON CONFLICT (reference) DO NOTHING
    `);
    console.log('✅ Products seeded');

    // ── Raw Materials ─────────────────────────────────────
    await sequelize.query(`
      INSERT INTO raw_material (supplier_id, reference, name, stock_quantity, reserved_quantity, safety_threshold, unit) VALUES
        ((SELECT supplier_id FROM supplier WHERE company_name='MetalSupply France'), 'MAT-ALU-6061',  'Aluminum 6061-T6 bar',          2500, 450,  500,  'kg'),
        ((SELECT supplier_id FROM supplier WHERE company_name='ArcelorMittal'),      'MAT-STEEL-304', '304L stainless steel plate',     1800, 320,  400,  'kg'),
        ((SELECT supplier_id FROM supplier WHERE company_name='TIMET Europe'),       'MAT-TITAN-GR5', 'Grade 5 titanium billet',         350,  85,   100,  'kg'),
        ((SELECT supplier_id FROM supplier WHERE company_name='DuPont Polymers'),    'MAT-VITON-75',  'Viton hardness 75 Shore',         180,  25,    50,  'kg'),
        ((SELECT supplier_id FROM supplier WHERE company_name='Eurocircuits'),       'MAT-ELECT-PCB', 'Multilayer printed circuit board', 850, 180,  200,  'unit'),
        ((SELECT supplier_id FROM supplier WHERE company_name='RS Components'),      'MAT-COMPO-RES', 'SMD resistors kit',                120,  15,    30,  'set'),
        ((SELECT supplier_id FROM supplier WHERE company_name='Lisi Aerospace'),     'MAT-VIS-M8',    'M8 aerospace titanium screws',   15000, 2500, 3000, 'unit'),
        ((SELECT supplier_id FROM supplier WHERE company_name='Shell Aviation'),     'MAT-OIL-HYD',   'Skydrol hydraulic oil',            450,  60,   100,  'L')
      ON CONFLICT (reference) DO NOTHING
    `);
    console.log('✅ Raw materials seeded');

    // ── Customer Orders ───────────────────────────────────
    await sequelize.query(`
      INSERT INTO customer_order (customer_id, order_date, expected_delivery, status, total_amount, is_urgent) VALUES
        ((SELECT customer_id FROM customer WHERE company_name='Lufthansa Technik'),       '2026-01-15', '2026-03-20', 'in_production', 125000, false),
        ((SELECT customer_id FROM customer WHERE company_name='Boeing Supply Chain'),      '2026-01-17', '2026-03-05', 'in_production',  89000, true),
        ((SELECT customer_id FROM customer WHERE company_name='Airbus Operations'),        '2026-01-20', '2026-04-15', 'confirmed',      245000, false),
        ((SELECT customer_id FROM customer WHERE company_name='Air France Industries'),    '2026-01-23', '2026-03-15', 'in_production',   67000, false),
        ((SELECT customer_id FROM customer WHERE company_name='DroneTech Industries'),     '2026-01-25', '2026-03-01', 'delivered',       34500, false),
        ((SELECT customer_id FROM customer WHERE company_name='Emirates Engineering'),     '2026-01-27', '2026-03-27', 'in_production',  156000, false),
        ((SELECT customer_id FROM customer WHERE company_name='Safran Aircraft Engines'),  '2026-01-30', '2026-03-10', 'in_production',   98000, true),
        ((SELECT customer_id FROM customer WHERE company_name='AeroSystems Canada'),       '2026-02-02', '2026-04-11', 'confirmed',       52000, false),
        ((SELECT customer_id FROM customer WHERE company_name='Nordic Aviation Parts'),    '2026-02-06', '2026-03-25', 'in_production',   71000, false),
        ((SELECT customer_id FROM customer WHERE company_name='Iberia Maintenance'),       '2026-02-10', '2026-04-09', 'confirmed',       89500, false),
        ((SELECT customer_id FROM customer WHERE company_name='Lufthansa Technik'),        '2026-02-13', '2026-03-30', 'in_production',  142000, true),
        ((SELECT customer_id FROM customer WHERE company_name='Boeing Supply Chain'),      '2026-02-15', '2026-04-05', 'confirmed',      198000, false)
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Customer orders seeded');

    // ── Production Orders ─────────────────────────────────
    await sequelize.query(`
      INSERT INTO production_order (product_id, site_id, created_by, order_number, planned_start, planned_end, status, priority, quantity_ordered) VALUES
        ((SELECT product_id FROM product WHERE reference='PROD-AX-2401'), (SELECT site_id FROM site WHERE name='Lyon site'),     (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0045', '2026-02-06', '2026-02-20', 'in_progress', 'high',     50),
        ((SELECT product_id FROM product WHERE reference='PROD-AX-2402'), (SELECT site_id FROM site WHERE name='Lyon site'),     (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0046', '2026-02-07', '2026-02-17', 'completed',   'high',    150),
        ((SELECT product_id FROM product WHERE reference='PROD-MT-1105'), (SELECT site_id FROM site WHERE name='Toulouse site'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0047', '2026-02-08', '2026-02-25', 'in_progress', 'critical', 20),
        ((SELECT product_id FROM product WHERE reference='PROD-EL-3301'), (SELECT site_id FROM site WHERE name='Lyon site'),     (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0048', '2026-02-10', '2026-02-23', 'planned',     'medium',    5),
        ((SELECT product_id FROM product WHERE reference='PROD-MT-1106'), (SELECT site_id FROM site WHERE name='Toulouse site'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0049', '2026-02-15', '2026-03-05', 'planned',     'medium',   80),
        ((SELECT product_id FROM product WHERE reference='PROD-DR-5501'), (SELECT site_id FROM site WHERE name='Lyon site'),     (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0050', '2026-02-06', '2026-02-19', 'in_progress', 'high',     80),
        ((SELECT product_id FROM product WHERE reference='PROD-DR-5502'), (SELECT site_id FROM site WHERE name='Lyon site'),     (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0051', '2026-02-07', '2026-02-18', 'completed',   'medium',   50),
        ((SELECT product_id FROM product WHERE reference='PROD-ST-7801'), (SELECT site_id FROM site WHERE name='Lyon site'),     (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0052', '2026-01-30', '2026-02-10', 'completed',   'low',     500),
        ((SELECT product_id FROM product WHERE reference='PROD-AX-2401'), (SELECT site_id FROM site WHERE name='Lyon site'),     (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0054', '2026-02-13', '2026-02-27', 'in_progress', 'critical', 60),
        ((SELECT product_id FROM product WHERE reference='PROD-MT-1105'), (SELECT site_id FROM site WHERE name='Toulouse site'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0055', '2026-02-14', '2026-03-02', 'in_progress', 'critical', 25),
        ((SELECT product_id FROM product WHERE reference='PROD-EL-3301'), (SELECT site_id FROM site WHERE name='Lyon site'),     (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'OF-2026-0056', '2026-02-16', '2026-03-01', 'in_progress', 'high',     15)
      ON CONFLICT (order_number) DO NOTHING
    `);
    console.log('✅ Production orders seeded');

    // ── Batches ───────────────────────────────────────────
    await sequelize.query(`
      INSERT INTO batch (production_order_id, operator_id, batch_number, manufacturing_date, status, quantity_produced) VALUES
        ((SELECT production_order_id FROM production_order WHERE order_number='OF-2026-0045'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'LOT-AX-2401-001', '2026-02-06', 'in_progress', 32),
        ((SELECT production_order_id FROM production_order WHERE order_number='OF-2026-0045'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'LOT-AX-2401-002', '2026-02-14', 'planned',      0),
        ((SELECT production_order_id FROM production_order WHERE order_number='OF-2026-0046'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'LOT-AX-2402-001', '2026-02-07', 'completed',  150),
        ((SELECT production_order_id FROM production_order WHERE order_number='OF-2026-0047'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'LOT-MT-1105-001', '2026-02-08', 'in_progress', 11),
        ((SELECT production_order_id FROM production_order WHERE order_number='OF-2026-0050'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'LOT-DR-5501-001', '2026-02-06', 'in_progress', 55),
        ((SELECT production_order_id FROM production_order WHERE order_number='OF-2026-0051'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'LOT-DR-5502-001', '2026-02-07', 'completed',   50),
        ((SELECT production_order_id FROM production_order WHERE order_number='OF-2026-0052'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'LOT-ST-7801-001', '2026-01-30', 'completed',  500),
        ((SELECT production_order_id FROM production_order WHERE order_number='OF-2026-0054'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'LOT-AX-2401-003', '2026-02-13', 'quarantined', 18),
        ((SELECT production_order_id FROM production_order WHERE order_number='OF-2026-0055'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'LOT-MT-1105-002', '2026-02-14', 'in_progress',  8),
        ((SELECT production_order_id FROM production_order WHERE order_number='OF-2026-0056'), (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'), 'LOT-EL-3301-001', '2026-02-16', 'quarantined',  6)
      ON CONFLICT (batch_number) DO NOTHING
    `);
    console.log('✅ Batches seeded');

    // ── Incidents ─────────────────────────────────────────
    await sequelize.query(`
      INSERT INTO incident (batch_id, reported_by, title, description, severity, status, detected_at) VALUES
        (
          (SELECT batch_id FROM batch WHERE batch_number='LOT-AX-2402-001'),
          (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'),
          'Dimension out of tolerance — Hydraulic valve',
          'Dimensional inspection revealed bore diameter 0.04mm outside EN9100 tolerance band. CNC machine recalibrated.',
          'medium', 'resolved', '2026-02-02'
        ),
        (
          (SELECT batch_id FROM batch WHERE batch_number='LOT-MT-1105-001'),
          (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'),
          'Surface roughness non-conformance — Drive shaft',
          'Surface roughness Ra measurement exceeds AS9100 specification on 3 units.',
          'low', 'investigating', '2026-02-07'
        ),
        (
          (SELECT batch_id FROM batch WHERE batch_number='LOT-EL-3301-001'),
          (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'),
          'Welding defect micro-crack — Engine control module',
          'X-ray inspection detected micro-crack in solder joint. DO-178C compliance review initiated. Batch quarantined.',
          'critical', 'investigating', '2026-02-10'
        ),
        (
          (SELECT batch_id FROM batch WHERE batch_number='LOT-DR-5501-001'),
          (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'),
          'Cosmetic scratch during packaging — Drone mount',
          'Surface scratch on 4 units during packaging. Packaging process improved.',
          'low', 'resolved', '2026-02-13'
        ),
        (
          (SELECT batch_id FROM batch WHERE batch_number='LOT-AX-2401-003'),
          (SELECT user_id FROM "user" WHERE email='karim@aeronexis.com'),
          'Hydraulic leak test failure at 350 bar',
          'Pressure leak test detected seal failure on 8 units. Suspected wrong Viton O-ring grade. Batch quarantined.',
          'critical', 'open', '2026-02-15'
        )
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Incidents seeded');

    // ── Shipments ─────────────────────────────────────────
    await sequelize.query(`
      INSERT INTO shipment (customer_order_id, site_id, shipment_date, shipment_type, tracking_number, status) VALUES
        (
          (SELECT customer_order_id FROM customer_order co JOIN customer c ON co.customer_id=c.customer_id WHERE c.company_name='DroneTech Industries' LIMIT 1),
          (SELECT site_id FROM site WHERE name='Lyon site'),
          '2026-02-10', 'air', 'DHL-2026-001', 'delivered'
        )
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Shipments seeded');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Login credentials (password: password):');
    console.log('  karim@aeronexis.com    → Operator (port 3001)');
    console.log('  claire@aeronexis.com   → Logistics (port 3002)');
    console.log('  sophie@aeronexis.com   → Sales (port 3003)');
    console.log('  philippe@aeronexis.com → Admin (port 3004)');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

runSeed();