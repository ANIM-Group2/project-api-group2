require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const sequelize = require('./src/config/postgres.config');
const { connectMongo } = require('./src/config/mongo.confing');
const { authenticate } = require('./src/middleware/auth.middleware');

const app  = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Public — no token needed
app.get('/health', (req, res) => res.json({ status: 'UP', service: 'ms-production' }));

// Everything below requires a valid JWT
app.use(authenticate);

app.use('/production/orders',    require('./src/routes/production.route'));
app.use('/production/products',  require('./src/routes/products.route'));
app.use('/production/batches',   require('./src/routes/batch.route'));
app.use('/production/incidents', require('./src/routes/incident.route'));

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ ms-production: PostgreSQL connected');
    await connectMongo();
    app.listen(PORT, () => console.log(`🏭 ms-production running on :${PORT}`));
  } catch (err) {
    console.error('❌ ms-production startup failed:', err);
    process.exit(1);
  }
}

start();