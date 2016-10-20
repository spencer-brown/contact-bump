const sync = require('synchronize');
const db = require('../db');


function router(app) {
  app.get('/', (req, res, next) => {
    sync.fiber(() => {
      const contacts = sync.await(db.collection('contacts').find({
      }, {
        name: 1,
        needsContacting: 1
      }, sync.defer()));

      res.render('index', {
        contacts
      });
    });
  });

  app.post('/contacts', (req, res, next) => {
    sync.fiber(() => {
      const contact = {
        name: req.body.name,
        needsContacting: !!req.body.needsContacting
      };
      console.log('req.body', req.body);

      sync.await(db.collection('contacts').insert(contact, sync.defer()));

      res.redirect('/');
    });
  });
}

module.exports = router;
