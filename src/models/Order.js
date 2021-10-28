const orderStatuses = require("./OrderStatuses");

class Order {
    constructor (id, userId, products, paymentMethod){
        this.id = id;
        this.userId = userId;
        this.time = new Date().toLocaleString();
        this.products = products;
        this.paymentMethod = paymentMethod;
        this.status = orderStatuses.NUEVO;
    }
}

module.exports = Order;