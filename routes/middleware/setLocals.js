module.exports = (app) => {
  app.use((req, res, next) => {
    res.locals.loggedIn = !!req.user;

    next();
  });
};
