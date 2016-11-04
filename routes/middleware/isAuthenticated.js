/**
 * Ensures that the client is logged in.
 *
 * If the client is not logged in, they will be redirected to /.
 */
module.exports = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
};
