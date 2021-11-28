const route = require('express').Router()

// Controllers
const usersC = require('../controllers/users.controller');
const usersM = require('../middlewares/users.middleware');

// Sends all the users
route.get('/', usersM.authenticate, usersM.isAdmin, usersC.allUsers);

// Register a new user
route.post('/', usersM.validateRegister, usersC.registerUser);

// Sends a jwt token to authenticate in another routes
route.post('/login', usersM.validateLogin, usersC.login);

// Enables/disables an user
route.patch('/:userID', usersM.authAdmin, usersM.validateEnabled, usersC.enableUser);

module.exports = route;