const http = require('http');
const app = require('./app');
const { connectDatabase } = require('./config/db');
const { initSockets } = require('./sockets/appointment.socket');
const { startReminderJob } = require('./jobs/reminder.job');
const { logger } = require('./config/logger');

const PORT = process.env.PORT || 4000;

async function startServer() {
  await connectDatabase();
  const server = http.createServer(app);
  initSockets(server);
  startReminderJob();

  server.listen(PORT, () => {
    logger.info(`Hospital Management API listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  logger.error('Server failed to start', error);
  process.exit(1);
});
