const User = require("../models/user");
const Users = require("../models/users");

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

function registerUser(req,res) {
    Users.register(req.body);
    res.sendStatus(200);
};

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

function login (req, res) {
    const loginBody = req.body;
    if (isLoginFieldsValid) {       
        const { username, password } = loginBody;
        const user = Users.list.find(u => u.username === username);
        if (user) {
            if (user.password === password) {
                const userID = user.id;
                res.status(200).json({userID});
            } else {
                // Contraseña incorrecta
                res.status(422).json({error: "Contraseña incorrecta"});
            }
        } else {
            // El usuario no existe
            res.status(404).json({error: "El usuario no existe"});
        }
    }
}


function allUsers(req, res){
    res.status(200).json(Users.list)
}

module.exports = {
    validateRegister,
    registerUser,
    allUsers,
    login,
}