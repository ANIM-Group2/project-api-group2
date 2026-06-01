require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const sequelize = require('./src/config/postgres.config');
const { connectMongo } = require('./src/config/mongo.config');
const { authenticate } = require('./src/middleware/auth.middleware');

const app  = express();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

// Public
app.get('/health', (req, res) => res.json({ status: 'UP', service: 'ms-traceability' }));

// Everything below requires a valid JWT
app.use(authenticate);

app.use('/traceability', require('./src/routes/traceability.route'));

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ ms-traceability: PostgreSQL connected');
    await connectMongo();
    app.listen(PORT, () => console.log(`🔍 ms-traceability running on :${PORT}`));
  } catch (err) {
    console.error('❌ ms-traceability startup failed:', err);
    process.exit(1);
  }
}

start();