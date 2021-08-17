class Order {
    constructor (id, idUser, paymentMethod, products){
        this.id = id;
        this.idUser = idUser;
        this.time = new Date().toLocaleString();
        this.products = products;
        this.paymentMethod = paymentMethod;
    }
}

module.exports = Order;