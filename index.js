const sync = require('synchronize');
const mongojs = require('mongojs');
const db = require('./db');
const express = require('express');
const app = express();
const config = require('./config');

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
    // TODO: Set these more intelligently - use existing env vars if they exist.
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    pass: config.REDIS_PASS
  })
}));

// Set up Passport.
// TODO: Move this logic somewhere else.
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
  clientID: config.FACEBOOK_APP_ID,
  clientSecret: config.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/login/facebook/return'
}, (accessToken, refreshToken, profile, cb) => {
  sync.fiber(() => {
    try {
      sync.await(db.collection('users').update({
        'facebook.profile.id': profile.id
      }, {
        $set: {
          facebook: {
            accessToken,
            profile
          }
        }
      }, {
        upsert: true
      }, sync.defer()));

      const user = sync.await(db.collection('users').findOne({
        'facebook.profile.id': profile.id
      }, sync.defer()));

      cb(null, user);
    } catch (e) {
      console.log('ERROR:', e);
      cb(e, null);
    }

  });
}));
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((userId, done) => {
  sync.fiber(() => {
    const user = sync.await(db.collection('users').findOne({
      _id: mongojs.ObjectId(userId)
    }, sync.defer()));

    done(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/login/facebook', passport.authenticate('facebook'));
app.get('/login/facebook/return',
  passport.authenticate('facebook', {failureRedirect: '/login'}),
  (req, res, next) => {
    res.redirect('/loggedin');
  });
app.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

// Require routes.
require('./routes')(app);

// Set up environment variables.
const args = process.argv.slice(2);
// TODO: Figure out a better way to do this with grunt-nodemon.
process.env.ENVIRONMENT = args[0].split('=')[1];

// TODO: Make this dynamic based on environment.
process.env.TWILIO_ACC_SID = config.TWILIO_ACC_SID;
process.env.TWILIO_AUTH_TOKEN = config.TWILIO_AUTH_TOKEN;

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
