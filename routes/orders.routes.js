const route = require('express').Router();
const usersM = require('../middlewares/user.middleware');

const { Orders } = require('../models/Data');

route.get('/orders', usersM.userIDValidation, (req,res) => {
    res.status(200).json({Orders});
});


module.exports = route;