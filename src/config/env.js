const dotenv = require('dotenv');
const path = require('path');

function loadEnv() {
  const envFile = path.resolve(process.cwd(), '.env');
  dotenv.config({ path: envFile });
}

module.exports = {
  loadEnv,
};
