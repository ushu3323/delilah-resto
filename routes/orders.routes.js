const route = require('express').Router();
const usersM = require('../middlewares/user.middleware');

const { Orders } = require('../models/Data');

route.get('/orders', usersM.idValidation, (req, res) => {
    res.status(200).json({Orders});
});

route.post('/orders', usersM.idValidation, (req, res) => {})

module.exports = route;