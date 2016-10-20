const mongojs = require('mongojs');

const DB_STRING = process.env.MONGODB_URI || 'contactbump';
const db = mongojs(DB_STRING);

module.exports = db;
