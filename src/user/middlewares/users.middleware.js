const { sha256 } = require("js-sha256");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const userRepository = require("../repositories/user.repository");

function isRegisterFieldsValid(reqBody) {
  // Comprueba si se enviaron los campos requeridos y si no estan vacios, para poder registrarse
  const { username, fullName, email, phoneNumber, address, password } = reqBody;

  /* Cuando se utiliza typeof para una variable que esta 'undefined' y 'null',
     este devuelve 'object', por lo que permite comprobar si el campo existe
      y si es del tipo esperado, todo en una sola condicional.
    */
  const expectedFieldsType =
    typeof username === "string" &&
    typeof fullName === "string" &&
    typeof email === "string" &&
    typeof phoneNumber === "string" &&
    typeof address === "string" &&
    typeof password === "string";
  const expectedFieldsValue =
    username !== "" &&
    fullName !== "" &&
    email !== "" &&
    phoneNumber !== "" &&
    phoneNumber !== "" &&
    password !== "";
  return expectedFieldsType && expectedFieldsValue;
}

async function validateRegister(req, res, next) {
  const { username, fullName, email, phoneNumber, address, password } =
    req.body;
  const userRegister = {
    username,
    fullName,
    email,
    phoneNumber,
    address,
    password,
  };
  req.userRegister = userRegister;

  let findResult;
  // console.log("validateRegister Middleware: ", req.userRegister);

  if (isRegisterFieldsValid(userRegister)) {
    // Comprueba si el nombre de usuario ya se encuentra en uso (Opcional)
    findResult = await userRepository.get.byUsername(username);
    if (findResult)
      return res
        .status(422)
        .json({ msg: "El nombre de usuario ya esta en uso", error: true });

    // Comprueba si el mail ya esta registrado
    findResult = await userRepository.get.byEmail(email);
    if (findResult)
      return res
        .status(422)
        .json({ msg: "El email ingresado ya esta en uso", error: true });

    next(); // Todo correcto, se procede a registrar el usuario
  } else {
    res.status(422).json({ msg: "Registro invalido", error: true });
  }
}

function isLoginFieldsValid(loginBody) {
  const { email, password } = loginBody;
  return (
    typeof email === "string" &&
    typeof password === "string" &&
    email !== "" &&
    password !== ""
  );
}

async function validateEnabled(req, res, next) {
  console.log("validateEnabled middleware");
  const { enabled } = req.body;
  const { userID: _userID } = req.params;
  const userID = parseInt(_userID);
  let user;

  if(isNaN(userID)) return res.status(422).json({msg: "la id es invalida", error: true});
  if (typeof enabled !== "boolean") return res.status(422).json({msg: "los campos son invalidos"});

  try {
    user = await userRepository.get.byId(userID);
    if(!user) return res.status(404).json({msg: `Usuario no encontrado`, error: true });
  } catch (error) {
    return next(error);
  }

  req.user = user;
  next();
}

async function validateLogin(req, res, next) {
  if (!isLoginFieldsValid(req.body))
    return res.status(422).json({ msg: "Los campos son invalidos", error: true });

  const { email, password } = req.body;
  user = await userRepository.get.byEmail(email);

  if (!user?.password || sha256(password) !== user.password) {
    return res.status(422).json({ msg: "Credenciales invalidas", error: true });
  }
  
  if (!user.enabled) return res.status(403).json({ msg: "El usuario esta deshabilitado", error: true })
  
  req.user = user;
  return next();
}

/**
 * @deprecated this will no longer work due to security reasons, instead use jwtValidation middleware and implement jwt in every controller
 */
function idHeaderValidation(req, res, next) {
  if (!req.header("userID")) {
    res.status(422).json({ msg: "Se esperaba userID en header", error: true });
    return;
  }

  const userID = parseInt(req.header("userID"));
  const user = userRepository.get.byId(userID);
  if (isNaN(userID) && !user) {
    res.status(422).json({ msg: "userID no es valido", error: true });
    return;
  }
  next();
}

function jwtDecode(token) {
  try {
    const decoded = jwt.verify(token, config.auth.jwt.key);
    return decoded;
  } catch (error) {
    console.log("JWT Error:", error.message);
  }
}

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  let user;
  if (!token) return res.status(401).json({ msg: "No se encontro un token", error: true });
  
  const jwtDecoded = jwtDecode(token);
  if(!jwtDecoded) return res.status(401).json({ msg: "Token invalido", error: true });

  try {
    user = await userRepository.get.byEmail(jwtDecoded.email);
    if (!user) return res.status(401).json({ msg: "Usuario no encontrado", error: true });
  } catch (error) {
    console.log("JWT Error:", error.message);
    return next(error);
  }

  if(!user.enabled) return res.status(403).json({msg: "El usuario esta deshabilitado", error: true})

  req.jwtUser = jwtDecoded;
  req.user = user
  next();
}

async function isAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      msg: "No esta autorizado",
      error: true,
    });
  }
}

function isAuthenticated(req, res, next) {
  if (req.user) return next()
  res.status(401).json({ msg: "No se encuentra autenticado", user: req.user});
}

/**
 * @deprecated this will no longer work due to security reasons, instead implement jwt in every route
 */
function isAdminMiddle(adminMiddleware, userMiddleware) {
  return async (req, res, next) => {
    if (req.user.isAdmin) adminMiddleware(req, res, next);
    else userMiddleware(req, res, next);
  };
}

module.exports = {
  validateRegister,
  validateEnabled,
  validateLogin,
  authenticate,
  idHeaderValidation,
  isAdminMiddle,
  isAuthenticated,
  isAdmin,
  authAdmin: [authenticate, isAdmin],
};
