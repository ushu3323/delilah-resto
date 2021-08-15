const route = require('express').Router()

// Controllers
const usersC = require('../controllers/users.controller');
const usersM = require('../middlewares/user.middleware');

const Users = require("../models/users");

// Obtiene todos los usuarios
route.get('/users', usersM.isAdmin, usersC.allUsers);

route.post('/users', usersC.validateRegister, usersC.registerUser);

route.post('/login', usersC.login);

module.exports = route;
