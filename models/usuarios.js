const User = require("./user");

const user_parameters = ["username", "fullname", "email", "number", "address", "password"];
//#region Users
function isParamsValid(userdata){

    // Comprueba si se ha ingresado SOLO los parametros solicitados
    for (p in userdata){
        if(!user_parameters.includes(p)){
            return false;
        }
    }

    // Comprueba si se han recibido todos los parametros solicitados
    user_parameters.forEach(p => {
        if(!userdata.hasOwnProperty(p)){
            return false;
        }
    });

    // Se realizaron todas las validaciones
    return true
}

function isRegisterValid(users, userdata){

    let emptyFieldMsg = (field_name) => `El campo '${field_name}' no puede quedar vacio`

    let result = {
        isValid: null,
        fields:{
            username:{
                valid: true,
                msg: "",
            },
            fullName:{
                valid: true,
                msg: "",
            },
            email:{
                valid: true,
                msg: "",
            },
            number:{
                valid: true,
                msg: "",
            },
            address:{
                valid: true,
                msg: "",
            },
            password:{
                valid: true,
                msg: "",
            },
        },
    };

    let found;
    if (userdata.username !== ""){
        found = users.find(u => u.username === userdata.username);
        if (found){
            result.fields.username = {
                valid: false,
                msg: "El nombre de usuario ya existe",
            }
        }
    } else {
        result.fields.username = {
            valid: false,
            msg: emptyFieldMsg("username"),
        }
    }

    result.fields.fullName = userdata.fullName !== "" ? result.fields.fullName : {valid: false, msg: emptyFieldMsg("fullName")};
    
    if (userdata.email !== ""){
        found = users.find(u => u.email === userdata.email);
        if (found){
            result.fields.email = {
                valid: false,
                msg: "El email ingresado ya se encuentra registrado",
            }
        }
    } else {
        result.fields.email = {
            valid: false,
            msg: emptyFieldMsg("email")
        }
    }

    result.fields.number = userdata.number !== "" ? result.fields.number : {valid: false, msg: emptyFieldMsg("number")};
    result.fields.address = userdata.address !== "" ? result.fields.address : {valid: false, msg: emptyFieldMsg("address")};
    result.fields.password = userdata.password !== "" ? result.fields.password : {valid: false, msg: emptyFieldMsg("password")};
    
    result.isValid = result.fields.username.valid && result.fields.fullName.valid && result.fields.email.valid && result.fields.number.valid && result.fields.password.valid; // Si todo esta en condiciones para registrar
    // console.log("validation:", result)
    return result;
}

//#endregion

function userLogin(login_json){
    
}

module.exports = class Usuarios {
    constructor() {
        this.list = [];
    }
    
    _newUser(userdata){
        return new User(
            userdata.username,
            userdata.fullName,
            userdata.email,
            userdata.number,
            userdata.address,
            userdata.password,
        )
    }
    
    register(userdata){
        console.log("registrando Usuario:", userdata);
        if (isParamsValid(userdata)){
            let result = isRegisterValid(this.list, userdata);
            if (result.isValid){
                this.list.push(this._newUser(userdata));
            } else {
                throw result.fields;
            }
        }else{
            throw Error("Compruebe si se han ingresado los datos requeridos para el registro del usuario")
        }
        

        console.log("Hola");
    }

    login(logindata){
        let l = logindata;
        let user = this.list.find(e => l.user === e.user);

        if (user.username){

        }
        
        console.log("Usuario Logueado correctamente!", user);
    }   

}
