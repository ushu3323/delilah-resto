const jwt = require('jsonwebtoken');
const User = require("../model/User");
const { Users } = require("../../models/Data");

function isRegisterFieldsValid(reqBody) {
    // Comprueba si se enviaron los campos requeridos y si no estan vacios, para poder registrarse

    const { username, fullname, email, phoneNumber, address, password} = reqBody;

    // Cuando se utiliza typeof para 'undefined' y 'null', este devuelve 'object', por lo que no afectaria al proposito de comprobar si los campos existen
    if(typeof username === "string" &&
       typeof fullname === "string" &&
       typeof email === "string" &&
       typeof phoneNumber === "string" &&
       typeof address === "string" &&
       typeof password === "string"
    ){
        if (username !== "" &&
            fullname !== "" &&
            email !== "" &&
            phoneNumber !== "" &&
            address !== "" &&
            password !== ""
        ){
            return true;
        } 
    }

    return false;
}

function validateRegister(req, res, next) {
    const userRegister = req.body;
    const { username, fullname, email, phoneNumber, address, password} = userRegister;
    let findResult;

    if(isRegisterFieldsValid(userRegister)){

        // Comprueba si el nombre de usuario ya se encuentra en uso
        findResult = Users.list.find(u => u.username === username);
        if (findResult) {
            res.status(422).json({
                error: "El nombre de usuario ya esta en uso",
            })
            return;
        }
        
        // Comprueba si el mail ya esta registrado
        findResult = Users.list.find( u => u.email === email);
        if (findResult){
            res.status(422).json({
                error: "El email ingresado ya se encuentra registrado"
            })
            return;
        }
        next(); // Todo correcto, se procede a registrar el usuario
    } else {
        res.status(422).json({
            error: "Los parametros son invalidos",
        })
    }
}

function isLoginFieldsValid(loginBody) {

    const { username, password } = loginBody;
    if (typeof username === "string" &&
    typeof password === "string"
    ) {
        if (username !== "" &&
            password !== ""
        ) {
            return true;
        }
    }
    return false;
}

function validateLogin (req, res, next) {

    if (!isLoginFieldsValid(req.body)){
        res.status(401).json({error: "Los campos son invalidos"});
        return;
    }
    
    const { username, password } = req.body
    
    const user = Users.list.find(u => u.username === username);
    if (user) { 
        if (user.password === password){
            req.user = user;
            next();
        } else {
            res.status(422).json({ msg: "Credenciales invalidas", error: true });
        }
        return
    }
    res.status(401).json({ msg: "Credenciales invalidas", error: true});
    
}

function idHeaderValidation(req, res, next) {
    if (!req.header("userID")) {
        res.status(422).json({error: "Se esperaba userID en header"});        
        return;
    }
    
    const userID = parseInt(req.header("userID"))
    const user = Users.list.find(u => u.id === userID);
    if(isNaN(userID) && !user) {
        res.status(422).json({error: "userID no es valido"});
        return;
    }
    next();
}

function jwtValidation(req, res, next) {
    const jwtToken = req.headers.authorization;
    

    try {
        const token = jwtToken.split(' ')[1];
        const decoded = jwt.verify(token, "un_token");
        console.log(decoded);
        next();
    } catch (error) {
        res.status(403).json({msg:"invalid token", error: true});
    }
}

function isAdmin(req, res, next){
    // Includes id validation
    const userID = parseInt(req.header("userID"));
    const user = Users.list.find( u => u.id === userID); // aqui retorno undefined

    // Si, por eso, queria validar eso
    if(user.isAdmin){
        next();
    } else {
        res.status(401).json({
            msg: "El usuario no tiene permisos de administrador"
        });
    }
};

function isAdminMiddle(adminMiddleware, userMiddleware) {
    return (req,res,next) => {
        const userID = parseInt(req.header("userID"));
        const user = Users.list.find( u => u.id === userID);
    
        if(user.isAdmin) adminMiddleware(req,res,next);
        else userMiddleware(req,res,next);
    }
}

module.exports = {
    validateRegister,
    validateLogin,
    idHeaderValidation,
    jwtValidation,
    isAdminMiddle,
    isAdmin
};