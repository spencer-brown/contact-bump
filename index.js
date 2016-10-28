const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Set up bodyParser.
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Set up templating.
app.set('view engine', 'pug');
app.locals.moment = require('moment');

// Set up static file serving.
app.use(express.static('public'));

// Require routes.
require('./routes')(app);

// Start the app.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('app started. listening on', port);
});

// Start jobs.
require('./jobs');

// Set up environment variables.
const args = process.argv.slice(2);
// TODO: Figure out a better way to do this with grunt-nodemon.
process.env.ENVIRONMENT = args[0].split('=')[1];
