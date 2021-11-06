const jwt = require('jsonwebtoken');
const config = require('../../config');
const userRepository = require('../repositories/user.repository');

function isRegisterFieldsValid(reqBody) {
    // Comprueba si se enviaron los campos requeridos y si no estan vacios, para poder registrarse
    const { username, fullName, email, phoneNumber, address, password } = reqBody;

    /* Cuando se utiliza typeof para una variable que esta 'undefined' y 'null',
     este devuelve 'object', por lo que permite comprobar si el campo existe
      y si es del tipo esperado, todo en una sola condicional.
    */
    const expectedFieldsType = (
        typeof username === "string" &&
        typeof fullName === "string" &&
        typeof email === "string" &&
        typeof phoneNumber === "string" &&
        typeof address === "string" &&
        typeof password === "string"
    )
    const expectedFieldsValue = (
        username !== "" &&
        fullName !== "" &&
        email !== "" &&
        phoneNumber !== "" &&
        phoneNumber !== "" &&
        password !== ""
    )
    return expectedFieldsType && expectedFieldsValue;
}

async function validateRegister(req, res, next) {
    const { username, fullName, email, phoneNumber, address, password } = req.body;
    const userRegister = { username, fullName, email, phoneNumber, address, password };
    req.userRegister = userRegister;

    let findResult;
    // console.log("validateRegister Middleware: ", req.userRegister);

    if (isRegisterFieldsValid(userRegister)) {

        // Comprueba si el nombre de usuario ya se encuentra en uso (Opcional)
        findResult = await userRepository.get.byUsername(username);
        if (findResult) 
        return res.status(422).json({msg: "El nombre de usuario ya esta en uso", error: true});
        

        // Comprueba si el mail ya esta registrado
        findResult = await userRepository.get.byEmail(email);
        if (findResult)
        return res.status(422).json({msg: "El email ingresado ya esta en uso", error: true});
        
        next(); // Todo correcto, se procede a registrar el usuario
    } else {
        res.status(422).json({ error: "Registro invalido" })
    }
}

function isLoginFieldsValid(loginBody) {
    const { email, password } = loginBody;
    return (
        (typeof email === "string" && typeof password === "string") &&
        (email !== "" && password !== "")
    )
}

async function validateLogin(req, res, next) {
    if (!isLoginFieldsValid(req.body))
    return res.status(422).json({ error: "Los campos son invalidos" });

    const { email, password } = req.body
    user = await userRepository.get.byEmail(email);

    if (user?.password === password) {
        req.user = user;
        return next();
    }

    res.status(422).json({ msg: "Credenciales invalidas", error: true });
}

/**
 * @deprecated this will no longer work due to security reasons, instead use jwtValidation middleware and implement jwt in every controller
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function idHeaderValidation(req, res, next) {

    if (!req.header("userID")) {
        res.status(422).json({ error: "Se esperaba userID en header" });
        return;
    }

    const userID = parseInt(req.header("userID"))
    const user = userRepository.get.byId(userID);
    if (isNaN(userID) && !user) {
        res.status(422).json({ error: "userID no es valido" });
        return;
    }
    next();
}

function jwtDecode(token) {
    try {
        const decoded = jwt.verify(token, config.server.key);
        return decoded;
    } catch (error) {
        console.log("JWT Error:", error.message);
    }
}

async function authenticate(req,res,next){
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No se encontro un token" });

    const jwtDecoded = jwtDecode(token);
    try {
      if(jwtDecoded){
        req.jwtUser = jwtDecoded;
        req.user = await userRepository.get.byEmail(jwtDecoded.email);
        next();
      } else {
        return res.status(403).json({ msg: "token invalido", error: true });
      }
    } catch (error) {
      console.log("JWT Error:", error.message);
      next(error);
    }
}

async function isAdmin(req, res, next) {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({
            msg: "No tiene permisos suficientes"
        });
    }
};

/**
 * @deprecated this will no longer work due to security reasons, instead implement jwt in every route
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function isAdminMiddle(adminMiddleware, userMiddleware) {
    return async (req, res, next) => {
        const user = await userRepository.get.byEmail(req.jwtuser.email);

        if (user.isAdmin) adminMiddleware(req, res, next);
        else userMiddleware(req, res, next);
    }
}

module.exports = {
    validateRegister,
    validateLogin,
    authenticate,
    idHeaderValidation,
    isAdminMiddle,
    isAdmin,
    authAdmin: [authenticate, isAdmin]
};