const orderStatuses = require("../../utils/OrderStatuses");
const orderRepository = require("../repository/order.repository");

const paypalService = require('../services/paypal');

async function getOrders(req, res, next) {
  try {
    if (req.user.isAdmin) {
      console.log("Getting all orders, admin:", req.user.email);
      const orders = await orderRepository.get.all();
      res.status(200).json(orders);
    } else {
      console.log("Getting orders of:", req.user.email);
      const userOrders = await orderRepository.get.byUserId(req.user.id);
      const jsonOrders = userOrders.map((order) => {
        let o = order.toJSON()
        delete o.userId
        delete o.paymentMethodId
        return o
      })
      res
        .status(200)
        .json(jsonOrders);
    }
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  try {
    const order = await orderRepository.create(req.orderBody, req.user, orderStatuses.NUEVO);
    res.status(201).json({ message: "Orden creada correctamente", error: false, new: order });
  } catch (error) {
    next(error);
  }
}

async function editOrder(req, res, next) {
  try {
    // show order only with the new modifications
    await orderRepository.edit(req.order, req.orderBody);
    const jsonOrder = req.order.toJSON()

    delete jsonOrder.user
    delete jsonOrder.userId
    delete jsonOrder.paymentMethodId

    res.status(200).json({ message: "Pedido modificado correctamente", error: false, order: jsonOrder });
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
    res.status(200).json({ message: "El estado del pedido ha sido cambiado correctamente", error: false, old, new: newStatus });
  } catch (error) {
    next(error);
  }
}

async function checkoutOrder(req, res, next) {
  const jsonOrder = req.order.toJSON();
  if (req.order.products.length == 0) return res.json({message: `La orden id ${req.order.id} no tiene productos`, error:true});

  // Parse order's products into Paypal order's items
  const paypalItems = jsonOrder.products.map((p) => ({
    name: p.name,
    unit_amount: { currency_code: "USD", value: p.price.toString() },
    quantity: `${p.amount}`
  }))

  try {
    const orderData = await paypalService.createOrder([{
      reference_id: jsonOrder.id.toString(),
      amount: {
        currency_code: "USD",
        value: req.order.total.toString(),
        breakdown: {
          item_total: { 
            currency_code: "USD",
            value: `${req.order.total}`.toString(),
          }
        }
      },
      items: paypalItems
    }])
    const approveLink = orderData.links.find((link) => link.rel === "approve");

    await req.order.update({checkout_id: orderData.id.toString()});
    res.redirect(approveLink.href);
  
  } catch (err) {
    next(err);
  }
}

async function checkoutReturn(req, res, next) {
  const { token:checkoutId, PayerID } = req.query;
  console.log(`Paypal order token: ${checkoutId} | payerId: ${PayerID}`);
  if(req.order.status !== orderStatuses.NUEVO) return res.sendStatus(400)
  try {
    const captureResponse = await paypalService.captureOrder(checkoutId);

    if(captureResponse.status !== "COMPLETED") return res.status(400) // checkout
    await req.order.update({status: orderStatuses.CONFIRMADO})
    let jsonOrder = req.order.toJSON()
    delete jsonOrder.total
    res.json({
      message: "Checkout exitoso!",
      paypal: catchResponse,
      order: {
        ...jsonOrder
      },
      total: req.order.total
    });
  } catch (err) {
    next(err);
  }
}

async function checkoutCancel(req, res, next) {
  req.order.update({checkout_id: null})
  .then(()=> {
    const orderJson = req.order.toJSON();
    delete orderJson.total;
    res.json({
      message: "Checkout cancelado",
      order: orderJson
    })
  }).catch((err) => next(err))
}
module.exports = {
  getOrders,
  addOrder,
  editOrder,
  editOrderStatus,
  checkoutOrder,
  checkoutReturn,
  checkoutCancel
};
