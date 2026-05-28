require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');
const { Pool } = require('pg');

const app  = express();
const PORT = process.env.PORT || process.env.API_PORT || 4003;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query('SELECT NOW()', (err) => {
  if (err) console.error('❌ PostgreSQL connection failed:', err.message);
  else console.log('✅ ms-orders: PostgreSQL connected');
});

// Optional RabbitMQ — won't crash if unavailable
let rabbitChannel = null;
async function connectRabbitMQ() {
  try {
    const amqp = require('amqplib');
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    rabbitChannel = await conn.createChannel();
    await rabbitChannel.assertQueue('order.events', { durable: true });
    console.log('✅ ms-orders: RabbitMQ connected');
  } catch (err) {
    console.warn('⚠️  RabbitMQ not available (continuing without messaging):', err.message);
  }
}
connectRabbitMQ();

function publishEvent(payload) {
  if (!rabbitChannel) return;
  try {
    rabbitChannel.sendToQueue('order.events', Buffer.from(JSON.stringify(payload)), { persistent: true });
  } catch (err) {
    console.warn('RabbitMQ publish error:', err.message);
  }
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'aeronexis_super_secret_key_2026');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/health', (req, res) => res.json({ status: 'UP', service: 'ms-orders' }));

// ════════════════════════════════════════════════
// CUSTOMER ORDERS — maps to customer_order table
// ════════════════════════════════════════════════

// GET /orders — all orders
app.get('/orders', authMiddleware, async (req, res) => {
  try {
    const { status, customer_id, urgent } = req.query;
    let query = `
      SELECT co.*,
             c.company_name AS customer_name, c.country,
             u.first_name || ' ' || u.last_name AS validated_by_name
      FROM customer_order co
      LEFT JOIN customer c ON co.customer_id = c.customer_id
      LEFT JOIN "user" u ON co.validated_by = u.user_id
      WHERE 1=1
    `;
    const params = [];
    if (status)         { params.push(status);      query += ` AND co.status = $${params.length}`; }
    if (customer_id)    { params.push(customer_id); query += ` AND co.customer_id = $${params.length}`; }
    if (urgent === 'true') query += ` AND co.is_urgent = true`;
    query += ' ORDER BY co.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /orders/:id — single order with lines
app.get('/orders/:id', authMiddleware, async (req, res) => {
  try {
    const [order, lines] = await Promise.all([
      pool.query(`
        SELECT co.*, c.company_name, c.email AS customer_email, c.country, c.phone,
               u.first_name || ' ' || u.last_name AS validated_by_name
        FROM customer_order co
        LEFT JOIN customer c ON co.customer_id = c.customer_id
        LEFT JOIN "user" u ON co.validated_by = u.user_id
        WHERE co.customer_order_id = $1
      `, [req.params.id]),
      pool.query(`
        SELECT ol.*, p.name AS product_name, p.reference AS part_number
        FROM order_line ol
        LEFT JOIN product p ON ol.product_id = p.product_id
        WHERE ol.customer_order_id = $1
      `, [req.params.id]),
    ]);

    if (!order.rows[0]) return res.status(404).json({ error: 'Order not found' });

    res.json({ success: true, data: { ...order.rows[0], lines: lines.rows } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /orders — create order
app.post('/orders', authMiddleware, async (req, res) => {
  const { customer_id, expected_delivery, is_urgent, total_amount } = req.body;
  if (!customer_id) return res.status(400).json({ error: 'customer_id required' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(`
      INSERT INTO customer_order (customer_id, order_date, expected_delivery, is_urgent, total_amount, status, validated_by, created_at)
      VALUES ($1, NOW(), $2, $3, $4, 'draft', $5, NOW())
      RETURNING *
    `, [customer_id, expected_delivery, is_urgent || false, total_amount || 0, req.user.userId]);

    await client.query('COMMIT');

    publishEvent({
      type: 'ORDER_CREATED',
      order_id: orderResult.rows[0].customer_order_id,
      is_urgent,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: orderResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

// PATCH /orders/:id/approve
app.patch('/orders/:id/approve', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE customer_order
      SET status = 'confirmed', validated_by = $1
      WHERE customer_order_id = $2 AND status IN ('draft', 'confirmed')
      RETURNING *
    `, [req.user.userId, req.params.id]);

    if (!result.rows[0]) return res.status(404).json({ error: 'Order not found or already processed' });

    publishEvent({
      type: 'ORDER_APPROVED',
      order_id: req.params.id,
      approved_by: `${req.user.firstName} ${req.user.lastName}`,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve order' });
  }
});

// PATCH /orders/:id/status
app.patch('/orders/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(`
      UPDATE customer_order SET status = $1 WHERE customer_order_id = $2 RETURNING *
    `, [status, req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ════════════════════════════════════════════════
// CUSTOMERS
// ════════════════════════════════════════════════

app.get('/customers', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*,
             COUNT(co.customer_order_id) AS total_orders,
             COALESCE(SUM(co.total_amount), 0) AS total_revenue
      FROM customer c
      LEFT JOIN customer_order co ON c.customer_id = co.customer_id
      GROUP BY c.customer_id
      ORDER BY total_revenue DESC NULLS LAST
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// ════════════════════════════════════════════════
// SALES KPIs
// ════════════════════════════════════════════════

app.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [kpis, byStatus, topCustomers] = await Promise.all([
      pool.query(`
        SELECT
          COALESCE(SUM(total_amount) FILTER (WHERE created_at >= date_trunc('year',  NOW())), 0) AS revenue_ytd,
          COALESCE(SUM(total_amount) FILTER (WHERE created_at >= date_trunc('month', NOW())), 0) AS revenue_mtd,
          COUNT(*) FILTER (WHERE status = 'draft')       AS pending_orders,
          COUNT(*) FILTER (WHERE status = 'confirmed')   AS active_orders,
          COUNT(*) FILTER (WHERE is_urgent = true AND status NOT IN ('delivered','cancelled')) AS urgent_orders
        FROM customer_order
      `),
      pool.query(`SELECT status, COUNT(*) AS count FROM customer_order GROUP BY status`),
      pool.query(`
        SELECT c.company_name, COUNT(co.customer_order_id) AS order_count,
               COALESCE(SUM(co.total_amount), 0) AS revenue
        FROM customer c
        JOIN customer_order co ON c.customer_id = co.customer_id
        GROUP BY c.customer_id, c.company_name
        ORDER BY revenue DESC
        LIMIT 5
      `),
    ]);

    res.json({
      success: true,
      data: {
        ...kpis.rows[0],
        orders_by_status: byStatus.rows,
        top_customers:    topCustomers.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ════════════════════════════════════════════════
// SHIPMENTS
// ════════════════════════════════════════════════

app.get('/shipments', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, co.customer_order_id, c.company_name AS customer_name, si.name AS site_name
      FROM shipment s
      JOIN customer_order co ON s.customer_order_id = co.customer_order_id
      JOIN customer c ON co.customer_id = c.customer_id
      JOIN site si ON s.site_id = si.site_id
      ORDER BY s.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

app.listen(PORT, () => console.log(`🛒 ms-orders running on port ${PORT}`));