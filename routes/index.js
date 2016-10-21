'use strict';

const sync = require('synchronize');
const mongojs = require('mongojs');

const db = require('../db');


const TWO_MINS_IN_MS = 2 * 60 * 1000;


function router(app) {
  app.get('/',  (req, res, next) => {
    res.render('teaser');
  });

  app.get('/hidden', (req, res, next) => {
    sync.fiber(() => {
      const contacts = sync.await(db.collection('contacts').find({
      }, {
        _id: 1,
        firstName: 1,
        lastName: 1,
        phoneNumber: 1,
        email: 1,
        bumpedAt: 1,
        needsBumpAt: 1
      }, sync.defer()));

      res.render('index', {
        contacts
      });
    });
  });

  app.post('/contacts', (req, res, next) => {
    sync.fiber(() => {
      const needsBumpAt = (req.body.needsContacting) ? Date.now() : Date.now() + TWO_MINS_IN_MS;
      const contact = {
        needsBumpAt,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email
      };

      console.log('creating contact', contact);

      sync.await(db.collection('contacts').insert(contact, sync.defer()));

      res.redirect('/hidden');
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
            needsBumpAt: Date.now() + TWO_MINS_IN_MS
          }
        }, sync.defer()));
      } catch (err) {
        console.log('ERROR:', err);
      }

      res.redirect('/hidden');
    });
  });

  app.post('/incoming', (req, res, next) => {
    sync.fiber(() => {
      console.log('incoming message Body:', req.body.Body);

      const msg = req.body.Body;
      const names = msg.toLowerCase().replace(' ', '').split(',');

      console.log('resetting', names);

      sync.await(db.collection('contacts').update({
        name: {
          $in: names
        }
      }, {
        $set: {
          needsBumpAt: Date.now() + TWO_MINS_IN_MS,
          bumpedAt: null
        }
      }, sync.defer()));

      res.sendStatus(200).end();
    });
  });
}

module.exports = router;
