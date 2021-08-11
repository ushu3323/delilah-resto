const express = require("express");
const routes = express.Router();
const Usuarios = require("../models/usuarios.js");
const users = new Usuarios();

function handleError(error){
    let final_error;
    if (error.name){
        if (error.name === "Error"){
            final_error = {
                message: error.message,
                // stack: error.stack,
            };
        } else {
            throw error;
        }
    } else {
        final_error = error;
    }
    return final_error;
}


routes.get("/users", (req,res) => {
    res.json(users.list)
});

routes.post("/users/login", (req,res) => {
    req.query
    let is_loggedin = userLogin(req.body)
    res.sendStatus(403);
});

routes.post("/users/new", (req,res) =>{
    // console.log("body:", req.body);
    // console.log("query:", req.query);
    try {
        users.register(req.body);
        res.sendStatus(200);
    } catch (error) {
        let final_error = handleError(error);

        console.log("an error has been ocurred:", final_error)
        res.status(500).json(final_error)
    }
});

routes.get("/", (req,res) =>{
    res.send("Hello, this is the index page!");
});

module.exports = routes;