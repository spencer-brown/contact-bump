const CronJob = require('cron').CronJob;
const sync = require('synchronize');
const twilio = require('twilio')('AC76f41e6e2fa773af3e74634d0fd2677b', '0c4f7b31b530bb6dc79a309801e7286d');
const _ = require('underscore');

const db = require('../db');


const ONCE_PER_MIN_PATTERN = '00 * * * * 1-5';
const THIRTY_SEC_IN_MS = 30 * 1000;

// Check for contacts that are ready to bump.
new CronJob(ONCE_PER_MIN_PATTERN, () => {
  sync.fiber(() => {
    const needContacting = sync.await(db.collection('contacts').find({
      // Expired contacts.
      needsBumpAt: {
        $lte: Date.now()
      },

      // Aren't in a pending state.
      bumpedAt: null
    }, {
      name: 1
    })

    // Limit to two contacts per day.
    .limit(2, sync.defer()));

    if (_.isEmpty(needContacting)) {
      console.log('no contacts to bump');
      return;
    } else {
      console.log('need contacting', needContacting);
    }

    // Send text about contacts.
    const joinedNames = _.pluck(needContacting, 'name').join(', ');
    const body = `Needs contacting: ${joinedNames}`;
    try {
      sync.await(twilio.sendMessage({
        body,
        to: '+17404053797',
        from: '+16697219661'
      }, sync.defer()));
    } catch(err) {
      console.log('ERROR:', err);
    }

    // Set `bumpedAt` on contacts.
    const contactIds = _.pluck(needContacting, '_id');
    try {
      sync.await(db.collection('contacts').update({
        _id: {
          $in: contactIds
        }
      }, {
        $set: {
          bumpedAt: Date.now()
        }
      }, sync.defer()));
    } catch (err) {
      console.log('ERROR:', err);
    }

    console.log('bumped', contactIds);
  });
}, null, true, 'America/Los_Angeles');
