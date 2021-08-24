const orderStatuses = require("./OrderStatuses");

class Order {
    constructor (id, idUser, products, paymentMethod){
        this.id = id;
        this.idUser = idUser;
        this.time = new Date().toLocaleString();
        this.products = products;
        this.paymentMethod = paymentMethod;
        this.status = orderStatuses.NUEVO;
    }
}

module.exports = Order;