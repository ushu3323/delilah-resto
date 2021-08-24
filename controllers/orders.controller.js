const { Orders, Users, Products, PaymentMethods } = require("../models/Data");

function getOrders (req, res) {
    const userID = parseInt(req.header("userID"));
    const user = Users.list.find(u => u.id === userID);
    
    if (user.isAdmin){
        console.log("Getting all orders, admin:", user);
        res.status(200).json(Orders.list); 
    } else {
        console.log("Getting orders of:", user);
        res.status(200).json(Orders.list.filter(order => order.idUser === userID));
    }
}

function orderProductsToProductsObj(orderProducts){
    const productsObjs = products.map(dataPair => {
        const { id, amount } = dataPair;
        return Products.getCopy(id, amount);
    });
}

function addOrder (req,res) {
    const { products, paymentMethodId } = req.body;
    const userID = parseInt(req.header("userID"));
    
    Orders.new(userID, orderProductsToProductsObj(products), paymentMethodId);
    res.sendStatus(201);
};

function editOrder (req, res) {
    const { products, paymentMethodId } = req.body;
    const orderId = parseInt(req.params.orderId);
    const order = Orders.getOrder(orderId);

    const productsObjs = products.map(p => {
        const {id, amount} = p;
        const item = Products.getCopy(id, amount);
        return item;
    });

    order.products = productsObjs;
    order.paymentMethod = PaymentMethods.getById(paymentMethodId);

    res.sendStatus(200).json({msg: "Pedido editado correctamente"});
};

function editOrderStatus (req, res) {
    const newStatus = req.body.status;

    const orderId = parseInt(req.params.orderId);
    const order = Orders.getOrder(orderId);
    
    order.status = newStatus;
    res.sendStatus(200).json({msg: "Estado pedido editado correctamente"});
};

module.exports = {
    getOrders,
    addOrder,
    editOrder,
    editOrderStatus
}