const Users = require('../models/users');

function HeaderUserIDValidation(req, res, next) {
    if (req.header("userID")) {
        const userID = parseInt(req.header("userID"))
        if(!isNaN(userID)) {
            next();
        } else {
            res.status(422).json({
                msg: "userID no es valido"
            });
        }
    } else {
        res.status(422).json({
            error: "Se esperaba userID en header",
        });        
    }
}

function isAdmin(req, res, next){
    const userID = parseInt(req.header("userID"));

    const user = Users.list.find( u => u.id === userID);
    if (!user){
        res.status(404).json({
            msg: "userID no es valido (Usuario inexistente)"
        });
        return;
    }
    
    if(user.isAdmin){
        next();
    } else {
        res.status(401).json({
            msg: "El usuario no tiene permisos de administrador"
        });
    }
};

module.exports = { isAdmin };