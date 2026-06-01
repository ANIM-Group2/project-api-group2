const mongoose = require('mongoose');

async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ ms-traceability: MongoDB connected');
}

module.exports = { connectMongo };