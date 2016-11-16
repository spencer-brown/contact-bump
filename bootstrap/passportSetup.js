const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const sync = require('synchronize');
const mongojs = require('mongojs');

const config = require('../config');
const db = require('../db');


module.exports = (app) => {

  let callbackURL;
  if (process.env.ENVIRONMENT === 'prod') {
    callbackURL = 'http://contact-bump-dev.us-east-1.elasticbeanstalk.com/login/facebook/return';
  } else if (process.env.ENVIRONMENT === 'dev') {
    callbackURL = 'http://localhost:3000/login/facebook/return';
  }

  // Configure Passport strategy.
  passport.use(new FacebookStrategy({
    callbackURL,
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
  }, (accessToken, refreshToken, profile, cb) => {
    sync.fiber(() => {
      try {
        sync.await(db.collection('users').update({
          'facebook.profile.id': profile.id
        }, {
          $setOnInsert: {
            _id: mongojs.ObjectID().toString()
          },
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

  // Configure session serialization and deserialization.
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((userId, done) => {
    sync.fiber(() => {
      const user = sync.await(db.collection('users').findOne({
        _id: userId
      }, sync.defer()));
  
      done(null, user);
    });
  });
  
  // Wire up Passport to Express. This needs to be included before the route definitions.
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Define necessary routes.
  app.get('/login/facebook', passport.authenticate('facebook'));
  app.get('/login/facebook/return',
    passport.authenticate('facebook', {failureRedirect: '/'}),
    (req, res, next) => {
      res.redirect('/feed');
    });
  app.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
  });
};
