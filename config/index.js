'use strict';

/**
 * Exports environment variables and other environment-based configuration.
 */


let config = {
  TWILIO_ACC_SID: process.env.TWILIO_ACC_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  REDIS_SECRET: process.env.REDIS_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASS: process.env.REDIS_PASS,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET
};

/**
 * Environment-based, non-secret config. We do this configuration here instead of in stored
 * environment variables because it's easier and it's unnecessary to keep these variables secret.
 */
if (process.env.ENVIRONMENT === 'dev') {
  config.FACEBOOK_CALLBACK_URL = 'http://localhost:3000/login/facebook/return';
} else if (process.env.ENVIRONMENT === 'prod') {
  config.FACEBOOK_CALLBACK_URL = 'http://contact-bump.spencer.sx/login/facebook/return';
}

module.exports = config;
