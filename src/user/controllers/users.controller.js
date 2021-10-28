const { Users } = require("../../models/Data");
const userRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');
const config = require('../../config');

function login(req, res) {
    const { email, password } = req.user;
    const token = jwt.sign({ email, password }, config.server.key);
    res.status(200).json({ token });
};

async function registerUser(req, res) {
    await userRepository.create(req.userRegister);
    res.status(201).json({ message: 'Usuario creado', error: false });
};

async function allUsers(req, res) {
    const users = await userRepository.get.all();
    res.status(200).json(users);
};

module.exports = {
    registerUser,
    allUsers,
    login
}