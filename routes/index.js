'use strict';

const sync = require('synchronize');
const mongojs = require('mongojs');

const db = require('../db');
const isAuthenticated = require('./middleware/isAuthenticated');


const TWO_MINS_IN_MS = 2 * 60 * 1000;


function router(app) {
  // Set app-wide locals.
  require('./middleware/setLocals')(app);

  app.get('/',  (req, res, next) => {
    if (req.user) {
      res.redirect('/feed');
    } else {
      res.render('index');
    }
  });

  app.get('/feed', isAuthenticated, (req, res, next) => {
    sync.fiber(() => {
      const contacts = sync.await(db.collection('contacts').find({
        userId: req.user._id
      }, {
        _id: 1,
        firstName: 1,
        lastName: 1,
        phoneNumber: 1,
        email: 1,
        bumpedAt: 1,
        needsBumpAt: 1,
        userId: 1
      }, sync.defer()));

      let data = {
        contacts
      };

      res.render('feed', data);
    });
  });

  app.post('/contacts', (req, res, next) => {
    sync.fiber(() => {
      const needsBumpAt = (req.body.needsContacting) ? Date.now() : Date.now() + TWO_MINS_IN_MS;
      const contact = {
        needsBumpAt,
        _id: mongojs.ObjectID().toString(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        userId: req.user._id
      };

      sync.await(db.collection('contacts').insert(contact, sync.defer()));

      res.redirect('/feed');
    });
  });

  app.post('/clearBump', (req, res, next) => {
    sync.fiber(() => {
      const contactId = req.body.contactId;

      try {
        sync.await(db.collection('contacts').update({
          _id: contactId
        }, {
          $set: {
            bumpedAt: null,
            needsBumpAt: Date.now() + TWO_MINS_IN_MS
          }
        }, sync.defer()));
      } catch (err) {
        console.log('ERROR:', err);
      }

      res.redirect('/feed');
    });
  });

  // TODO: Support responses via Twilio to mark people as contacted.
  //
  // app.post('/incoming', (req, res, next) => {
  //   sync.fiber(() => {
  //     console.log('incoming message Body:', req.body.Body);

  //     const msg = req.body.Body;
  //     const names = msg.toLowerCase().replace(' ', '').split(',');

  //     console.log('resetting', names);

  //     sync.await(db.collection('contacts').update({
  //       // TODO: Fix this query.
  //       // - `name` is not a field anymore.
  //       // - This query should incorporate the user ID.
  //       // - Need to do something smarter than name-matching in case there are conflicts.
  //       name: {
  //         $in: names
  //       }
  //     }, {
  //       $set: {
  //         needsBumpAt: Date.now() + TWO_MINS_IN_MS,
  //         bumpedAt: null
  //       }
  //     }, sync.defer()));

  //     res.sendStatus(200).end();
  //   });
  // });
}

module.exports = router;
