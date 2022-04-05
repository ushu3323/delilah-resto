const route = require('express').Router()

// Controllers
const usersC = require('../controllers/users.controller');
const usersM = require('../middlewares/users.middleware');

// Sends all the users
route.get('/', usersM.isAuthenticated, usersM.isAdmin, usersC.allUsers);

// Register a new user
route.post('/', usersM.validateRegister, usersC.registerUser);

// Sends active session user
route.get('/me', usersM.isAuthenticated, (req,res) => {
  const user = req.user.toJSON(); // user is a sequelize object
  delete user.password;

  res.json(user);
})

// Enables/disables an user
route.patch('/:userID', usersM.isAuthenticated, usersM.isAdmin, usersM.validateEnabled, usersC.enableUser);

module.exports = route;