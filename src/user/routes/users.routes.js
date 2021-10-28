const route = require('express').Router()

// Controllers
const usersC = require('../controllers/users.controller');
const usersM = require('../middlewares/users.middleware');

// Sends all the users
route.get('/', usersM.authenticate, usersM.isAdmin, usersC.allUsers);

// Register a new user
route.post('/', usersM.validateRegister, usersC.registerUser);

// Send the unique id of the user that is being logged
route.post('/login', usersM.validateLogin, usersC.login);

module.exports = route;