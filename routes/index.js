const sync = require('synchronize');
const db = require('../db');


function router(app) {
  app.get('/', (req, res, next) => {
    sync.fiber(() => {
      const contacts = sync.await(db.collection('contacts').find({}, sync.defer()));

      res.render('index', {
        contacts
      });
    });
  });

  app.post('/contacts', (req, res, next) => {
    sync.fiber(() => {
      const contact = {
        name: req.body.name
      };

      sync.await(db.collection('contacts').insert(contact, sync.defer()));

      res.redirect('/');
    });
  });
}

module.exports = router;
