const Admin = require("./admin.js");
const User = require("./user.js");

class Users {
    constructor() {
        this.list = [
            new User(1, "queen_freddie", "Freddie Mercury", "freddiemercury@server.com", "+44 7712345678", "1 Logan PIKensington, London W8 6DE, UK", "1234"),
            new Admin(2, "admin", "Administrador", "admin1234@server.com", "+44 3535236", "20 Street, Rio Grande, AR", "admin"),
            // new User(3, "stejobs20", "Steve Jobs", "steveJobs20@server.com", "+44 12545410", "102 Street, LA, US", "123456"),
        ];
    }
    
    _newUser(userdata){
        const lastUser = this.list[this.list.length-1]
        const id = lastUser.id || 0
        
        return new User(
            
            id + 1, // Id autoincremental 
            userdata.username,
            userdata.fullName,
            userdata.email,
            userdata.phoneNumber,
            userdata.address,
            userdata.password,
        )
    }
    
    register(userdata){
        console.log("Intento de registro de Usuario:", userdata);
        this.list.push(this._newUser(userdata));
        // console.log("LISTA", this.list);
    }

    login(logindata){
        let l = logindata;
        let user = this.list.find(e => l.username === e.username);

        if (user.username){

        }
        
        console.log("Usuario Logueado correctamente!", user);
    }   

}

module.exports = new Users();