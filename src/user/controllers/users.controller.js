const { Users } = require("../../models/Data");
const userRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');
const config = require('../../config');

function login(req, res) {
    const { email, password } = req.user;
    const token = jwt.sign({ email, password }, config.server.key);
    res.status(200).json({ token });
};

async function registerUser(req, res, next) {
  try {
    await userRepository.create(req.userRegister);
    res.status(201).json({ message: 'Usuario creado', error: false });
  } catch (error) {
    next(error);
  }
};

async function allUsers(req, res, next) {
  try {
    const users = await userRepository.get.all();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

async function enableUser(req, res, next) {
  const { enabled } = req.body;
  try {
    req.user.enabled = enabled;
    await req.user.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
    registerUser,
    enableUser,
    allUsers,
    login,
}