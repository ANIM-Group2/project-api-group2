require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const sequelize = require('./src/config/postgres.config');
const { connectMongo } = require('./src/config/mongo.config');

const app  = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'UP', service: 'ms-inventory' }));
app.use('/stock', require('./src/routes/inventory.route'));

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ ms-inventory: PostgreSQL connected');
    await connectMongo();
    app.listen(PORT, () => console.log(`📦 ms-inventory running on :${PORT}`));
  } catch (err) {
    console.error('❌ ms-inventory startup failed:', err);
    process.exit(1);
  }
}

start();