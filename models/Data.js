const Admin = require("./Admin");
const User = require("./User");

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

const Order = require('./Order');
class Orders {
    constructor(){
        const { Dishes, PaymentMethods} = Data;
        this.list = [
            new Order(1, 1, Dishes.get(1,1), PaymentMethods.getId("Efectivo"))
        ]
    }

    getOrder(orderId) {
        const order = this.list.find(o => o.id === orderId);
        return order
    }
}

const Dish = require('./Dish');
class Dishes {
    constructor() {
        this.list = [
            new Dish(1, "Hamburguesa Clásica", 350.0),
        ];
    }
    
    /**
     * Devuelve el primer platillo encontrado
     *  @param x valor a buscar, si es number buscara por id, si es string buscara por nombre
     *  @param amount Cantidad de platillos, por defecto `1`
     */
    get(x, amount=1){
        
        let dish; 
        switch (typeof x) {
            case "string":
                dish = this.list.find(d => d.name === x);
                break;
            case "number":
                dish = this.list.find(d => d.id === x);
                break;
            default:
                throw new Error(`El tipo tiene que ser 'string' o 'number', se encontro ${typeof x}`);
                break;
        }
        if (dish){
            dish.amount = amount;
        }
        return dish
    }
}

const PaymentMethod = require('./PaymentMethod');
class PaymentMethods {
    constructor() {
        this.list = [
            new PaymentMethod(1, "Efectivo"),
            new PaymentMethod(2, "Contado"),
        ];
    }

    get(paymentName){
        const pMethod = this.list.find(p => p.name);
        return pMethod ? pMethod.id : null
    }
}

const Data = {
    Users: new Users(),
    Orders: new Orders(),
    Dishes: new Dishes(),
    PaymentMethods: new PaymentMethods(),
}
module.exports = Data;