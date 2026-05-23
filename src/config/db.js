const mongoose = require('mongoose');
const { logger } = require('./logger');

async function connectDatabase() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-management';
  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  logger.info('Connected to MongoDB');
}

module.exports = {
  connectDatabase,
};
