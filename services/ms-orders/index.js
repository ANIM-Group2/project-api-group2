require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const { Pool }  = require('pg');
const { authenticate } = require('./src/middleware/auth.middleware');

const app  = express();
const PORT = process.env.PORT || process.env.API_PORT || 4003;

app.use(cors());
app.use(express.json());

// ── PostgreSQL ────────────────────────────────────────────────
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query('SELECT NOW()', (err) => {
  if (err) console.error('❌ PostgreSQL connection failed:', err.message);
  else     console.log('✅ ms-orders: PostgreSQL connected');
});

// ── RabbitMQ (optional) ───────────────────────────────────────
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

app.locals.pool = pool;
app.locals.publishEvent = function (payload) {
  if (!rabbitChannel) return;
  try {
    rabbitChannel.sendToQueue('order.events', Buffer.from(JSON.stringify(payload)), { persistent: true });
  } catch (err) {
    console.warn('RabbitMQ publish error:', err.message);
  }
};

// ── Public ────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'UP', service: 'ms-orders' }));

// ── Everything below requires a valid JWT ─────────────────────
app.use(authenticate);

app.use('/orders',    require('./src/routes/order.route'));
app.use('/shipments', require('./src/routes/shipment.route'));
app.use('/customers', require('./src/routes/customer.route'));
app.use('/stats',     require('./src/routes/stats.route'));

app.listen(PORT, () => console.log(`🛒 ms-orders running on port ${PORT}`));