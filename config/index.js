/**
 * Copy this file into config/index.js and complete with the appropriate values.
 */
let config = {};
if (process.env.ENVIRONMENT === 'prod') {
  config.TWILIO_ACC_SID = process.env.TWILIO_ACC_SID;
  config.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  config.REDIS_SECRET = process.env.REDIS_SECRET;
  config.REDIS_HOST = process.env.REDIS_HOST;
  config.REDIS_PORT = process.env.REDIS_PORT;
  config.REDIS_PASS = process.env.REDIS_PASS;
  config.FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
  config.FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
} else {
  // dev
  console.log('process.env.ENVIRONMENT was', process.env.ENVIRONMENT);
  config = require(`./${process.env.ENVIRONMENT}`);
}

module.exports = config;
