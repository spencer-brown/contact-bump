const mongojs = require('mongojs');
const sync = require('synchronize');

const DB_STRING = process.env.MONGODB_URI || 'contactbump';
const db = mongojs(DB_STRING);


// Create indexes.
sync.fiber(() => {
  sync.await(db.collection('contacts').createIndex({
    userId: 1
  }, sync.defer()));

  sync.await(db.collection('users').createIndex({
    'facebook.profile.id': 1
  }, sync.defer()));
});

module.exports = db;
