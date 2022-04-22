const passport = require('passport');
const route = require('express').Router();


route.get('/logout', (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logOut();
    res.status(200).json({ message: "Logout existoso", error: false });
  } else {
    res.status(400).json({ message: "No se puede realizar un logout, no se encuentra autenticado", error: true});
  }
});

// Login a user
route.post('/local/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (info) return res.status(401).json({ message: info.message, error: true });
    let jsonUser = user.toJSON(); // user is a sequelize object
    delete jsonUser.password;
    req.login(user, (err) => err ? next(err) : null);
    res.json({ message: "autenticado correctamente", user: jsonUser, error: false });
  })(req, res, next);
});

route.get('/google/login', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

route.get(
  '/google/callback',
  passport.authenticate('google', {authInfo: true}),
  (req, res, next) => {
    if (req.info && !req.user) return res.json({ message: req.info.message, error: true })

    const user = req.user.toJSON();
    delete user.credentials
    req.login(req.user, (err) => err ? next(err) : null);
    res.json({ message: "autenticado correctamente", user });
  }
);

module.exports = route;