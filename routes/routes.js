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

routes.post("/login", (req,res) => {
    req.header("")
    let is_loggedin = userLogin(req.body)
    res.sendStatus(403);
});

routes.post("/users", (req,res) =>{
    // console.log("body:", req.body);
    // console.log("query:", req.query);
    try {
        users.register(req.body);
        res.sendStatus(200);
    } catch (error) {
        let final_error = handleError(error);

        console.log("an error has been ocurred:", final_error);
        res.status(500).json(final_error);
    }
});


routes.get("/", (req,res) =>{
    res.send("<h2>Servicio de gestion de pedidos del restaurante \"Delilah Restó\"</h2><p>Porfavor, dirigase a /docs para mas informacion acerca de como usar esta API</p>");
});

module.exports = routes;