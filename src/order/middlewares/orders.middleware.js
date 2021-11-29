const { Products, Orders } = require("../../models/Data");
const Order = require("../../models/Order");
const orderStatuses = require("../../utils/OrderStatuses");
const paymentMethodRepository = require("../../paymentMethod/repository/paymentMethod.repository");
const productRepository = require("../../product/repositories/product.repository");
const orderRepository = require("../repository/order.repository");

async function orderExists(req, res, next) {
  const orderId = parseInt(req.params.orderId);
  if (isNaN(orderId)) {
    return res
      .status(422)
      .json({ msg: "El numero de orden es invalido", error: true });
  }

  try {
    const order = await orderRepository.get.byId(orderId, false);
    if (!order) return res.status(404).json({ msg: `La orden con id ${orderId} no existe` });
    req.order = order;
    next();
  } catch (error) {
    next(error);
  }
}

async function validateOrderBody(req, res, next) {
  console.log("validateOrderBody...")
  const { products, paymentMethodId } = req.body;
  if (
    !(typeof products === "object" && Array.isArray(products)) ||
    typeof paymentMethodId !== "number"
  ) {
    res.status(422).json({ msg: "Los campos son invalidos", error: true });
    return;
  }
  const payMethod = await paymentMethodRepository.get.byId(paymentMethodId);
  if (!payMethod || !payMethod.enabled) {
    return res.status(422).json({ msg: "El metodo de pago no existe", error: true });
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

    const productInstance = await productRepository.get.byId(id);
    if (!productInstance?.enabled) { // If the product is not enabled or does not exist
      res.status(422).json({ error: req.user.isAdmin ? "El producto no esta habilitado" : `El producto con id ${id} no existe`}); // No existe para el usuario
      return;
    }
  }
  req.orderBody = { products, paymentMethodId };
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

function isOrderOwner(req, res, next) {
  if (req.order.userId !== req.user.id) {
    return res.status(401).json({
      msg: "No es posible editar este pedido, solo se permiten modificar pedidos propios",
      error: true,
    });
  }
  next();
}

function canSetOrderStatus(req, res, next) {
  const newStatus = req.body.status; // Status to set

  switch (req.order.status) {
    case orderStatuses.NUEVO:
      if (newStatus !== orderStatuses.CONFIRMADO) {
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

  if (req.order.userId !== req.user.id) {
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
  validateOrderBody,
  isOrderOwner,
  validateOrderStatus,
  canSetOrderStatus,
};
