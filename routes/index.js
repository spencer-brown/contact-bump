function router(app) {
  app.get('/', (req, res, next) => {
    const contacts = [{
      name: 'Ben'
    }, {
      name: 'Rhys'
    }, {
      name: 'Evan'
    }, {
      name: 'Steezy'
    }, {
      name: 'Jess'
    }];

    res.render('index', {
      contacts
    });
  });
}

module.exports = router;
