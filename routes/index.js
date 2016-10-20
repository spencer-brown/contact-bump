'use strict';

const sync = require('synchronize');
const mongojs = require('mongojs');

const db = require('../db');


const THIRTY_SEC_IN_MS = 30 * 1000;


function router(app) {
  app.get('/', (req, res, next) => {
    sync.fiber(() => {
      const contacts = sync.await(db.collection('contacts').find({
      }, {
        _id: 1,
        name: 1,
        bumpedAt: 1
      }, sync.defer()));

      res.render('index', {
        contacts
      });
    });
  });

  app.post('/contacts', (req, res, next) => {
    sync.fiber(() => {
      const needsBumpAt = (req.body.needsContacting) ? Date.now() : Date.now() + THIRTY_SEC_IN_MS;
      const contact = {
        needsBumpAt,
        name: req.body.name
      };

      sync.await(db.collection('contacts').insert(contact, sync.defer()));

      res.redirect('/');
    });
  });

  app.get('/testsms', (req, res, next) => {
    sync.fiber(() => {
      try {
        sync.await(twilio.sendMessage({
          to: '+17404053797',
          from: '+16697219661',
          body: 'test sms'
        }, sync.defer()));
      } catch (err) {
        console.log('ERROR:', err);
      }

      res.send('Sent test text message.');
    });
  });

  app.post('/clearBump', (req, res, next) => {
    sync.fiber(() => {
      const contactId = req.body.contactId;

      try {
        sync.await(db.collection('contacts').update({
          _id: mongojs.ObjectId(contactId)
        }, {
          $set: {
            bumpedAt: null,
            needsBumpAt: Date.now() + THIRTY_SEC_IN_MS
          }
        }, sync.defer()));
      } catch (err) {
        console.log('ERROR:', err);
      }

      res.redirect('/');
    });
  });
}

module.exports = router;
