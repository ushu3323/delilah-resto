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
        .json({ message: "El nombre de usuario ya esta en uso", error: true });

    // Comprueba si el mail ya esta registrado
    findResult = await userRepository.get.byEmail(email);
    if (findResult)
      return res
        .status(422)
        .json({ message: "El email ingresado ya esta en uso", error: true });

    next(); // Todo correcto, se procede a registrar el usuario
  } else {
    res.status(422).json({ message: "Registro invalido", error: true });
  }
}

async function validateEnabled(req, res, next) {
  console.log("validateEnabled middleware");
  const { enabled } = req.body;
  const { userID: _userID } = req.params;
  const userID = parseInt(_userID);
  let user;

  if (isNaN(userID)) return res.status(422).json({ message: "la id es invalida", error: true });
  if (typeof enabled !== "boolean") return res.status(422).json({ message: "los campos son invalidos" });

  try {
    user = await userRepository.get.byId(userID);
    if (!user) return res.status(404).json({ message: `Usuario no encontrado`, error: true });
  } catch (error) {
    return next(error);
  }

  req.user = user;
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
  res.status(401).json({ message: "No se encuentra autenticado", user: req.user});
}

function isAdminMiddle(adminMiddleware, userMiddleware) {
  return async (req, res, next) => {
    if (req.user.isAdmin) adminMiddleware(req, res, next);
    else userMiddleware(req, res, next);
  };
}

module.exports = {
  validateRegister,
  validateEnabled,
  isAdminMiddle,
  isAuthenticated,
  isAdmin,
};
