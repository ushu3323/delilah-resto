const route = require('express').Router()
const users = require('../models/usuarios');

// Obtiene todos los usuarios
route.get('/users', (req,res) => {
    res.status(200).json(users.list);
});

route.post("users/new", (req,res) => {
    try {
        users.register(req.body);
        res.sendStatus(200)
    } catch (error) {
        let final_error = handleError(error);
    }
});
