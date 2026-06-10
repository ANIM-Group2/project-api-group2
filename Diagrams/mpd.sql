-- ============================================================
--  AERONEXIS DYNAMICS — PostgreSQL Schema
--  Run this FIRST in pgAdmin before running the seed
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS
CREATE TYPE user_status       AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE production_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE batch_status      AS ENUM ('planned', 'in_progress', 'completed', 'quarantined', 'rejected');
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status   AS ENUM ('open', 'investigating', 'resolved', 'closed');
CREATE TYPE movement_type     AS ENUM ('entry', 'exit', 'reservation', 'cancellation', 'adjustment');
CREATE TYPE shipment_status   AS ENUM ('planned', 'ready', 'shipped', 'delivered', 'returned');
CREATE TYPE priority_level    AS ENUM ('low', 'normal', 'medium', 'high', 'urgent', 'critical');
CREATE TYPE order_status      AS ENUM ('draft', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled');
CREATE TYPE kpi_report_type   AS ENUM ('production', 'inventory', 'sales', 'quality', 'global');

-- ROLE
CREATE TABLE IF NOT EXISTS role (
  role_id   SERIAL PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

-- SITE
CREATE TABLE IF NOT EXISTS site (
  site_id  SERIAL PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  address  TEXT,
  country  VARCHAR(100) NOT NULL
);

-- USER
CREATE TABLE IF NOT EXISTS "user" (
  user_id       SERIAL PRIMARY KEY,
  role_id       INT NOT NULL REFERENCES role(role_id),
  site_id       INT REFERENCES site(site_id),
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status        user_status NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CUSTOMER
CREATE TABLE IF NOT EXISTS customer (
  customer_id  SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email        VARCHAR(255) NOT NULL UNIQUE,
  phone        VARCHAR(50),
  address      TEXT,
  country      VARCHAR(100),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- SUPPLIER
CREATE TABLE IF NOT EXISTS supplier (
  supplier_id  SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email        VARCHAR(255) NOT NULL UNIQUE,
  phone        VARCHAR(50),
  country      VARCHAR(100),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- PRODUCT
CREATE TABLE IF NOT EXISTS product (
  product_id  SERIAL PRIMARY KEY,
  reference   VARCHAR(100) NOT NULL UNIQUE,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  unit_price  DECIMAL(12,2) NOT NULL DEFAULT 0,
  status      VARCHAR(50) NOT NULL DEFAULT 'active'
);

-- RAW MATERIAL
CREATE TABLE IF NOT EXISTS raw_material (
  material_id       SERIAL PRIMARY KEY,
  supplier_id       INT REFERENCES supplier(supplier_id),
  reference         VARCHAR(100) NOT NULL UNIQUE,
  name              VARCHAR(255) NOT NULL,
  stock_quantity    DECIMAL(12,3) NOT NULL DEFAULT 0,
  reserved_quantity DECIMAL(12,3) NOT NULL DEFAULT 0,
  safety_threshold  DECIMAL(12,3) NOT NULL DEFAULT 0,
  unit              VARCHAR(20) NOT NULL
);

-- PRODUCT MATERIAL
CREATE TABLE IF NOT EXISTS product_material (
  product_id        INT NOT NULL REFERENCES product(product_id),
  material_id       INT NOT NULL REFERENCES raw_material(material_id),
  quantity_required DECIMAL(12,3) NOT NULL,
  PRIMARY KEY (product_id, material_id)
);

-- CUSTOMER ORDER
CREATE TABLE IF NOT EXISTS customer_order (
  customer_order_id SERIAL PRIMARY KEY,
  customer_id       INT NOT NULL REFERENCES customer(customer_id),
  validated_by      INT REFERENCES "user"(user_id),
  order_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery DATE,
  status            order_status NOT NULL DEFAULT 'draft',
  total_amount      DECIMAL(14,2) NOT NULL DEFAULT 0,
  is_urgent         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ORDER LINE
CREATE TABLE IF NOT EXISTS order_line (
  customer_order_id INT NOT NULL REFERENCES customer_order(customer_order_id),
  product_id        INT NOT NULL REFERENCES product(product_id),
  quantity          INT NOT NULL CHECK (quantity > 0),
  unit_price        DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (customer_order_id, product_id)
);

-- PRODUCTION ORDER
CREATE TABLE IF NOT EXISTS production_order (
  production_order_id SERIAL PRIMARY KEY,
  product_id          INT NOT NULL REFERENCES product(product_id),
  customer_order_id   INT REFERENCES customer_order(customer_order_id),
  site_id             INT NOT NULL REFERENCES site(site_id),
  created_by          INT NOT NULL REFERENCES "user"(user_id),
  order_number        VARCHAR(100) NOT NULL UNIQUE,
  creation_date       TIMESTAMP NOT NULL DEFAULT NOW(),
  planned_start       TIMESTAMP,
  planned_end         TIMESTAMP,
  status              production_status NOT NULL DEFAULT 'planned',
  priority            priority_level NOT NULL DEFAULT 'normal',
  quantity_ordered    INT NOT NULL CHECK (quantity_ordered > 0)
);

-- MATERIAL RESERVATION
CREATE TABLE IF NOT EXISTS material_reservation (
  reservation_id      SERIAL PRIMARY KEY,
  production_order_id INT NOT NULL REFERENCES production_order(production_order_id),
  material_id         INT NOT NULL REFERENCES raw_material(material_id),
  quantity_reserved   DECIMAL(12,3) NOT NULL CHECK (quantity_reserved > 0),
  reserved_at         TIMESTAMP NOT NULL DEFAULT NOW(),
  released_at         TIMESTAMP,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

-- BATCH
CREATE TABLE IF NOT EXISTS batch (
  batch_id            SERIAL PRIMARY KEY,
  production_order_id INT NOT NULL REFERENCES production_order(production_order_id),
  operator_id         INT REFERENCES "user"(user_id),
  batch_number        VARCHAR(100) NOT NULL UNIQUE,
  manufacturing_date  TIMESTAMP NOT NULL DEFAULT NOW(),
  expiration_date     TIMESTAMP,
  status              batch_status NOT NULL DEFAULT 'planned',
  quantity_produced   INT NOT NULL DEFAULT 0,
  notes               TEXT
);

-- BATCH MATERIAL (traceability)
CREATE TABLE IF NOT EXISTS batch_material (
  batch_id      INT NOT NULL REFERENCES batch(batch_id),
  material_id   INT NOT NULL REFERENCES raw_material(material_id),
  quantity_used DECIMAL(12,3) NOT NULL CHECK (quantity_used > 0),
  lot_number    VARCHAR(100),
  PRIMARY KEY (batch_id, material_id)
);

-- INCIDENT
CREATE TABLE IF NOT EXISTS incident (
  incident_id  SERIAL PRIMARY KEY,
  batch_id     INT NOT NULL REFERENCES batch(batch_id),
  reported_by  INT NOT NULL REFERENCES "user"(user_id),
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  severity     incident_severity NOT NULL DEFAULT 'medium',
  detected_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at  TIMESTAMP,
  status       incident_status NOT NULL DEFAULT 'open'
);

-- INVENTORY MOVEMENT
CREATE TABLE IF NOT EXISTS inventory_movement (
  movement_id    SERIAL PRIMARY KEY,
  material_id    INT NOT NULL REFERENCES raw_material(material_id),
  performed_by   INT NOT NULL REFERENCES "user"(user_id),
  reservation_id INT REFERENCES material_reservation(reservation_id),
  type           movement_type NOT NULL,
  quantity       DECIMAL(12,3) NOT NULL,
  movement_date  TIMESTAMP NOT NULL DEFAULT NOW(),
  notes          TEXT
);

-- SHIPMENT
CREATE TABLE IF NOT EXISTS shipment (
  shipment_id       SERIAL PRIMARY KEY,
  customer_order_id INT NOT NULL REFERENCES customer_order(customer_order_id),
  site_id           INT NOT NULL REFERENCES site(site_id),
  prepared_by       INT REFERENCES "user"(user_id),
  shipment_date     TIMESTAMP,
  shipment_type     VARCHAR(50),
  tracking_number   VARCHAR(255),
  status            shipment_status NOT NULL DEFAULT 'planned',
  created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

-- KPI REPORT
CREATE TABLE IF NOT EXISTS kpi_report (
  report_id    SERIAL PRIMARY KEY,
  generated_by INT REFERENCES "user"(user_id),
  site_id      INT REFERENCES site(site_id),
  report_type  kpi_report_type NOT NULL,
  period_start DATE NOT NULL,
  period_end   DATE NOT NULL,
  generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  data         JSONB
);

-- AI AGENT LOG
CREATE TABLE IF NOT EXISTS ai_agent_log (
  ai_log_id           SERIAL PRIMARY KEY,
  user_id             INT REFERENCES "user"(user_id),
  related_batch_id    INT REFERENCES batch(batch_id),
  related_material_id INT REFERENCES raw_material(material_id),
  action_type         VARCHAR(100) NOT NULL,
  recommendation      TEXT,
  confidence_score    DECIMAL(5,4) CHECK (confidence_score BETWEEN 0 AND 1),
  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_user_role         ON "user"(role_id);
CREATE INDEX IF NOT EXISTS idx_user_site         ON "user"(site_id);
CREATE INDEX IF NOT EXISTS idx_batch_prod_order  ON batch(production_order_id);
CREATE INDEX IF NOT EXISTS idx_batch_status      ON batch(status);
CREATE INDEX IF NOT EXISTS idx_incident_batch    ON incident(batch_id);
CREATE INDEX IF NOT EXISTS idx_incident_sev      ON incident(severity);
CREATE INDEX IF NOT EXISTS idx_prod_order_site   ON production_order(site_id);
CREATE INDEX IF NOT EXISTS idx_prod_order_status ON production_order(status);
CREATE INDEX IF NOT EXISTS idx_reservation_active ON material_reservation(production_order_id) WHERE is_active = TRUE;
