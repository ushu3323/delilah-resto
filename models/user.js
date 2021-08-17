module.exports = class User {
    constructor (id, username, fullname, email, phoneNumber, address, password){
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.password = password;
        this.isAdmin = false;
    }
}

const parameters = ["usuario", "nombre_completo", "email", "tel", "password"];


//#region Users
function isDataValid(user_register){
    user_register.keys().forEach(p => {
        // Comprueba si se ha ingresado SOLO parametros solicitados
        if(!parameters.includes(p)){
            return false;
        }
    });

    // Comprueba si se han recibido todos los parametros solicitados
    parameters.forEach(p => {
        if(!user_register.HasOwnProperty(p)){
            return false;
        }
    });

    // Se realizaron todas las validaciones
    return true
}


function userValidation(user){
    // Comprueba si el mail no se ha utilizado
    let v = {
        valid: true,
        email: true,
        name: true,
        property: true
    };
    // Valida mail
    users.forEach(e_user => {
        if (e_user.email === user.email) {
            v.email = false;
        }
    });
    

    v.valid = v.email && v.name; // Si todo esta en condiciones para registrar
    console.log("validacion:", v)
    return v;
}

function errorCauseMsg(validacion){
    let v = validacion;
    if (!v.email){
        return "El email ingresado ya esta registrado";
    } else if (!v.name){
        return "El nombre debe contener solo caracteres validos [a-zA-Z]"
    } else if (false){

    }
}
//#endregion

function userLogin(login_json){
    let l = login_json;
    users.forEach(e =>{
        if(l.user === e.user){
            if(l.pass === e.pass){

            }
        }
    })
}