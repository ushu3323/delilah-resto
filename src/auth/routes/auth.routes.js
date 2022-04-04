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
route.post('/local/login', passport.authenticate('local'), (req, res) => {
  const user = req.user.toJSON(); // user is a sequelize object
  delete user.password;
  res.json({ msg: "autenticado correctamente", user, error: false });
});

module.exports = route;