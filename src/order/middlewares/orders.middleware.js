const { Products, Orders } = require("../../models/Data");
const Order = require("../../models/Order");
const orderStatuses = require("../../models/OrderStatuses");
const productRepository = require("../../product/repositories/product.repository");
const orderRepository = require("../repository/order.repository");

function orderExists(req, res, next) {
  const orderId = parseInt(req.params.orderId);
  if (isNaN(orderId)) {
    res
      .status(422)
      .json({ msg: "El numero de orden es invalido", error: true });
    return;
  }

  if (!Orders.getOrder(orderId)) {
    res.status(404).json({ msg: `La orden con id ${orderId} no existe` });
    return;
  }

  next();
}

async function validateNewOrder(req, res, next) {
  const { products, paymentMethodId } = req.body;

  if (
    !(typeof products === "object" && Array.isArray(products)) ||
    typeof paymentMethodId !== "number"
  ) {
    res.status(422).json({ msg: "Los campos son invalidos", error: true });
    return;
  }

  // Validates if every object in the products array contains the required parameters (name, amount)
  for (let product of products) {
    const { id, amount } = product;
    if (!(id && amount)) {
      res.status(422).json({ msg: "Los productos son invalidos", error: true });
      return;
    }
    if (typeof id !== "number" && typeof amount !== "number") {
      res.status(422).json({ msg: "Los productos son invalidos", error: true });
      return;
    }
    const productObj = await productRepository.get.byId(id);
    if (!productObj?.enabled) {
      res.status(422).json({ error: `El producto con id ${id} no existe` }); // No existe para el usuario
      return;
    }
  }

  next();
}

function validateOrderStatus(req, res, next) {
  const orderStatus = req.body.status;

  if (!orderStatus) {
    res.status(422).json({ msg: "Los campos son invalidos", error: true });
    return;
  }
  
  for (s of Object.values(orderStatuses)) {
    if (s === orderStatus) {
      next();
      return;
    }
  }

  res.status(422).json({ msg: "El estado ingresado es invalido", error: true });
}

function canEditOrder(req, res, next) {
  const userID = parseInt(req.header("userID"));
  const orderId = parseInt(req.params.orderId);
  const order = Orders.getOrder(orderId);

  if (order.status !== orderStatuses.NUEVO) {
    res.status(422).json({
      msg: "No se puede editar un pedido confirmado, pruebe cancelandolo y creando un nuevo pedido",
      error: true,
    });
    return;
  }

  if (order.userId !== userID) {
    res.status(401).json({
      msg: "No es posible editar este pedido, solo se permiten modificar pedidos propios",
      error: true,
    });
    return;
  }

  next();
}

function canSetOrderStatus(req, res, next) {
  const userID = parseInt(req.header("userID"));
  const orderId = parseInt(req.params.orderId);
  const order = Orders.getOrder(orderId);

  const newStatus = req.body.status; // Status to set

  switch (order.status) {
    case orderStatuses.NUEVO:
      if (
        newStatus !== orderStatuses.CONFIRMADO &&
        newStatus !== orderStatuses.CONFIRMADO
      ) {
        // The user wants to change the order to a state that he cant set
        res.status(422).json({
          error: `El usuario no puede cambiar el pedido a ese estado (${newStatus})`,
          validStatuses: [orderStatuses.CONFIRMADO, orderStatuses.CANCELADO],
        });
        return;
      }
      break;
    case orderStatuses.CONFIRMADO:
      if (newStatus !== orderStatuses.CANCELADO) {
        res
          .status(422)
          .json({
            msg: "El pedido ya esta confirmado",
            error: true,
            validStatus: [orderStatuses.CANCELADO],
          });
        return;
      }
      break;

    case orderStatuses.CANCELADO:
      res
        .status(422)
        .json({
          msg: "No se puede modificar el estado, el pedido esta Cancelado",
          error: true,
        });
      return;
      break;

    default:
      // Any other state
      if (newStatus !== orderStatuses.CANCELADO) {
        res
          .status(422)
          .json({
            msg: "El pedido ya esta siendo procesado",
            error: true,
            validStatus: [orderStatuses.CANCELADO],
          });
        return;
      }
      break;
  }

  if (order.userId !== userID) {
    res.status(401).json({
      msg: "No se puede editar este pedido, solo se permite modificar pedidos propios",
      error: true,
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
};
