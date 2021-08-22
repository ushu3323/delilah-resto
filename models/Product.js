class Product {
    constructor(id, name, price=0.0, enabled=false){
        this.id = id;
        this.name = name;
        this.price = price;
        this.enabled = enabled;
    }
}

module.exports = Product;