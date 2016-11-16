const express = require('express');
const app = express();


// Set up environment variables.
const args = process.argv.slice(2);
// TODO: Figure out a better way to do this with grunt-nodemon.
process.env.ENVIRONMENT = args[0].split('=')[1];
const config = require('./config');


// TODO: Make this dynamic based on environment.
process.env.TWILIO_ACC_SID = config.TWILIO_ACC_SID;
process.env.TWILIO_AUTH_TOKEN = config.TWILIO_AUTH_TOKEN;

// Set up bodyParser.
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Set up templating.
app.set('view engine', 'pug');
app.locals.moment = require('moment');

// Set up static file serving.
app.use(express.static('public'));

// Set up sessions.
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: config.REDIS_SECRET,
  store: new RedisStore({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    pass: config.REDIS_PASS
  })
}));

// Set up Passport.
require('./bootstrap/passportSetup.js')(app);

// Require routes.
require('./routes')(app);

// Set locals for pug.
app.locals.env = {};
app.locals.env[process.env.ENVIRONMENT] = true;

// Start the app.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('app started. listening on', port);
});

// Start jobs.
require('./jobs');
