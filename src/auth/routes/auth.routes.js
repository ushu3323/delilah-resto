const route = require('express').Router();

route.get('/logout', (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logOut();
    res.status(200).json({ msg: "Logout existoso", error: false });
  } else {
    res.status(400).json({msg: "No se puede realizar un logout, no se encuentra autenticado", error: true});
  }
});


module.exports = route;