const { Products, Orders } = require("../models/Data");
const Order = require("../models/Order");
const orderStatuses = require("../models/OrderStatuses");

function orderExists(req,res,next) {
    const orderId = parseInt(req.params.orderId);
    if (isNaN(orderId)) {
        res.status(422).json({error: "El numero de orden es invalido"});
        return;
    }
    
    if (!Orders.getOrder(orderId)){
        res.status(404).json({error: `La orden con id ${orderId} no existe`});
        return;
    }
    next();
}

function validateNewOrder(req, res, next) {
    const { products, paymentMethodId } = req.body;

    if (!(typeof products === "object" && Array.isArray(products)) || typeof paymentMethodId !== "number") {
        res.status(422).json({error: "Los campos son invalidos"});
        return;
    }
    
    // Validates if every object in the products array contains the required parameters (name, amount)
    products.forEach(product => {
        const { id, amount } = product;
        if (!(id && amount)) {
            res.status(422).json({error: "Los productos son invalidos"});
            return;
        }

        if (typeof id !== "number" && typeof amount !== "number"){
            res.status(422).json({error: "Los productos son invalidos"});
            return;
        }
        const productObj = Products.get(id) 
        if (!productObj || !productObj.enabled){
            res.status(422).json({error: `El producto con id ${id} no existe`}); // No existe para el usuario
            return;
        }

    });

    next();
}

function validateOrderStatus(req,res,next) {
    const orderStatus = req.body.status;
    
    if(!orderStatus){
        res.status(422).json({error: "Los campos son invalidos"}); return;
    }
    Object.values
    for (s of Object.values(orderStatuses)){
        if(s === orderStatus) {
            next();
            return;
        }
    }

    res.status(422).json({error: "El estado ingresado es invalido"});
}

function canEditOrder(req,res,next) {
    const userID = parseInt(req.header("userID"));
    const orderId = parseInt(req.params.orderId);
    const order = Orders.getOrder(orderId);


    if (order.status !== orderStatuses.NUEVO) {
        res.status(422).json({
            error: "No se puede editar un pedido confirmado, pruebe cancelandolo y creando un nuevo pedido"
        });
        return;
    }
    
    if (order.idUser !== userID){
        res.status(401).json({
            error: "No es posible editar este pedido, solo se permiten modificar pedidos propios"
        });
        return;
    }

    next();
}

function canSetOrderStatus(req,res,next) {
    const userID = parseInt(req.header("userID"));
    const orderId = parseInt(req.params.orderId);
    const order = Orders.getOrder(orderId);

    const newStatus = req.body.status; // Status to set
    
    switch (order.status) {
        case orderStatuses.NUEVO:
            if(newStatus !== orderStatuses.CONFIRMADO && newStatus !== orderStatuses.CONFIRMADO) {
                // The user wants to change the order to a state that he cant set
                res.status(422).json({
                    error: `El usuario no puede cambiar el pedido a ese estado (${newStatus})`, validStatuses: [orderStatuses.CONFIRMADO, orderStatuses.CANCELADO],
                });
                return;
            }
            break;
        case orderStatuses.CONFIRMADO:
            if(newStatus !== orderStatuses.CANCELADO){
                res.status(422).json({error: "El pedido ya esta confirmado", validStatus: [orderStatuses.CANCELADO]});
                return;
            }
            break;

        case orderStatuses.CANCELADO:
            res.status(422).json({error: "No se puede modificar el estado, el pedido esta Cancelado"});
            return;
            break;
            
        default: // Any other state
            if(newStatus !== orderStatuses.CANCELADO) {
                res.status(422).json({error: "El pedido ya esta siendo procesado", validStatus: [orderStatuses.CANCELADO]});
                return;
            }
            break;
    }


    if (order.idUser !== userID){
        res.status(401).json({
            error: "No se puede editar este pedido, solo se permite modificar pedidos propios"
        });
        return;
    }

    next();
}

module.exports = {
    orderExists,
    validateNewOrder,
    canEditOrder,
    validateOrderStatus,
    canSetOrderStatus,
}