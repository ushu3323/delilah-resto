const {
  Orders,
  Users,
  Products,
  PaymentMethods,
} = require("../../models/Data");
const orderStatuses = require("../../utils/OrderStatuses");
const orderRepository = require("../repository/order.repository");

async function getOrders(req, res, next) {
  try {
    if (req.user.isAdmin) {
      console.log("Getting all orders, admin:", req.user.email);
      const orders = await orderRepository.get.all();
      res.status(200).json(orders);
    } else {
      console.log("Getting orders of:", req.user.email);
      const userOrders = await orderRepository.get.byUserId(req.user.id);
      res
        .status(200)
        .json(userOrders);
    }
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  try {
    const order = await orderRepository.create(req.orderBody, req.user, orderStatuses.NUEVO);
    res.status(201).json({ msg: "Orden creada correctamente", error: false, new: order });
  } catch (error) {
    next(error);
  }
}

async function editOrder(req, res, next) {
  try {
    const result = await orderRepository.edit(req.order, req.orderBody);
    res.status(200).json({ msg: "Pedido editado correctamente", error: false });
  } catch (error) {
    next(error);
  }
}

async function editOrderStatus(req, res, next) {
  const { status: newStatus } = req.body;

  const old = req.order.status;
  req.order.status = newStatus;
  try {
    await req.order.save();
    res.status(200).json({ msg: "El estado del pedido ha sido cambiado correctamente", error: false, old, new: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOrders,
  addOrder,
  editOrder,
  editOrderStatus,
};
