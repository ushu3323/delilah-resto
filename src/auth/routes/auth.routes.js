const route = require('express').Router();
const passport = require('passport');

route.get('/logout', (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logOut();
    res.status(200).json({ msg: "Logout existoso", error: false });
  } else {
    res.status(400).json({msg: "No se puede realizar un logout, no se encuentra autenticado", error: true});
  }
});

// Login a user
route.post('/local/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (info) return res.status(401).json({ msg: info.message, error: true });
    let jsonUser = user.toJSON(); // user is a sequelize object
    delete jsonUser.password;
    req.login(user, next);
    res.json({ msg: "autenticado correctamente", user: jsonUser, error: false });
  })(req, res, next);
});

module.exports = route;