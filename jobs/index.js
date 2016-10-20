const CronJob = require('cron').CronJob;
const sync = require('synchronize');

const db = require('../db');


const EVERY_SECOND_PATTERN = '* * * * * *';

// Check for contacts that are more than 1 minute old.
new CronJob(EVERY_SECOND_PATTERN, () => {
  sync.fiber(() => {
    const contacts = sync.await(db.collection('contacts').find({
      needsContacting: true
    }, {
      name: 1
    }, sync.defer()));

    console.log('needs contacting:', contacts);
  });
}, null, true, 'America/Los_Angeles');
