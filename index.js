const express = require('express');
const app = express();

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
