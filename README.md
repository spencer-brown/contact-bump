# Contact Bump

Your personal assistant for keeping in touch with important contacts

## Dev Setup

1. Copy config/example.json to config/index.json and complete the newly created file with the appropriate values.

## Database Collections

`users` - accounts of users registered on Contact Bump
* {String} _id
* {Object} facebook - contains data fetched on Facebook login such as the user's access token and profile data.
* {String} facebook.accessToken
* {Ojbect} facebook.profile

`contacts` - user-created contact records
* _id
* {Number} needsBumpAt - ms timestamp indicating the next time this contact will be bumped
* {String} firstname
* {String} lastName
* {String} phoneNumber
* {String} email
* {String} userId - ID of the user who created this contact
* {Number} bumpedAt - ms timestamp denoting when this user was bumped. a non-null value for this field indicates that the contact is awaiting contacting.
