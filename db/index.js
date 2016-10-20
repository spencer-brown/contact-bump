const mongojs = require('mongojs');

const db = mongojs('contactbump');

module.exports = db;
