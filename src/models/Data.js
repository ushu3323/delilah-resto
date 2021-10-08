const Admin = require("../user/model/Admin");
const User = require("../user/model/User");
class Users {
    constructor() {
        this.list = [
            new Admin(1, "admin", "Administrador", "admin1234@server.com", "+44 3535236", "20 Street, Rio Grande, AR", "admin"),
            new User(2, "queen_freddie", "Freddie Mercury", "freddiemercury@server.com", "+44 7712345678", "1 Logan PIKensington, London W8 6DE, UK", "1234"),
            // new User(3, "stejobs20", "Steve Jobs", "steveJobs20@server.com", "+44 12545410", "102 Street, LA, US", "123456"),
        ];
    }
    
    _newUser(userdata){
        const lastUser = this.list.slice(-1)[0];
        const id = lastUser ? lastUser.id : 0;
        
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
        console.log("Usuario registrado:", userdata);
        this.list.push(this._newUser(userdata));
        // console.log("LISTA", this.list);
    }
}

const Order = require('./Order');
class Orders {
    constructor(){
        let testOrderProduct = new Product(1, "Hamburguesa Clásica", 350.0)
        testOrderProduct.amount = 10;

        this.list = [
            new Order(1, 1, [testOrderProduct], new PaymentMethod(1, "Efectivo"))
        ]
    }

    new(userId, products, paymentMethodId){
        const payMethod = Data.PaymentMethods.getById(paymentMethodId);
        const lastOrder = this.list.slice(-1)[0];
        const lastId = lastOrder ? lastOrder.id : 0;

        const newOrder = new Order(lastId+1, userId, products, payMethod);
        this.list.push(newOrder);
        return newOrder;
    }

    getOrder(orderId) {
        const order = this.list.find(o => o.id === orderId);
        return order;
    }
}

const Product = require('./Product');
class Products {
    constructor() {
        this.list = [
            new Product(1, "Hamburguesa Clásica", 350.0),
            new Product(2, "Bagel de salmòn", 350.0, true),
        ];
    }
    add(name, price) {
        const lastUser = this.list.slice(-1)[0];
        const id = lastUser ? lastUser.id : 0;

        this.list.push(new Product(id+1,name,price));
    }

    setIdProductEnabled(id, enabled) {
        const product = this.list.find(p => p.id === id);
        product.enabled = enabled;
    }
    
    /**
     * Returns a copy of the first product that satisfies the value to search, useful when making orders
     *  @param x value to compare, if it is Number search by id, otherwise search by name
     *  @param amount Amount of products
     */
    getCopy(x, amount=0){
        
        let product; 
        switch (typeof x) {
            case "string":
                product = this.list.find(d => d.name === x);
                break;
            case "number":
                product = this.list.find(d => d.id === x);
                break;
            default:
                throw new Error(`El tipo tiene que ser 'string' o 'number', se encontro ${typeof x}`);
                break;
        }
        // Returns a copy of the product, with the "amount" property
        return {...product, amount: amount};
        
        return product; // Returns the product from the list, this can be edited and will be applied too in the list
    }
    /**
     * Returns the first product that satisfies the value to search
     *  @param x value to compare, if it is Number search by id, otherwise search by name
     */
    get(x) {
        let product = null;
        switch (typeof x) {
            case "string":
                product = this.list.find(d => d.name === x);
                break;
            case "number":
                product = this.list.find(d => d.id === x);
                break;
            default:
                throw new Error(`El tipo tiene que ser 'string' o 'number', se encontro ${typeof x}`);
                break;
        }

            // Returns the product of the list, this can be edited and each change will be reflected in the list
            return product;
    }

    get listEnabled () {
        const enabledProducts = [];
        this.list.forEach(product => {
            if(product.enabled){
                enabledProducts.push({...product});
            }
        });

        // Removes "enabled" parameter to all the products before sending the response
        enabledProducts.map(product => {
            delete product.enabled;
            return product;
        });
        return enabledProducts
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
    getById(id) {
        const pMethod = this.list.find(p => p.id === id);
        if (pMethod) return pMethod;
        else throw new Error(`There's no payment method with id: ${id}`) 
    }
    getByName(name) {
        const pMethod = this.list.find(p => p.name === name);
        if (pMethod) return pMethod;
        else throw new Error(`There's no payment method with name: ${name}`);
    }
}

const Data = {
    Users: new Users(),
    Orders: new Orders(),
    Products: new Products(),
    PaymentMethods: new PaymentMethods(),
}

function addTestValues(){
    const { Users, Orders, Products, PaymentMethods} = Data;
}


module.exports = Data;