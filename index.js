const express = require('express');
const app = express();

// Set up bodyParse.
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Set up templating.
app.set('view engine', 'pug');

// Set up static file serving.
app.use(express.static('public'));

// Require routes.
require('./routes')(app);

// Start the app.
app.listen(3000, () => {
  console.log('app started');
});

// Start jobs.
require('./jobs');
