const route = require('express').Router();

const usersM = require('../../user/middlewares/users.middleware');
const ordersM = require('../middlewares/orders.middleware');
const { getOrders, addOrder, editOrder, editOrderStatus, checkoutOrder, checkoutReturn, checkoutCancel} = require('../controllers/orders.controller');

const orderRepository = require('../repository/order.repository');
const orderStatuses = require('../../utils/OrderStatuses');

route.use(usersM.isAuthenticated);

route.get('/', getOrders);

route.post('/', ordersM.validateOrderBody, addOrder);

route.put('/:orderId',
  ordersM.orderExists,
  ordersM.validateOrderBody,
  usersM.isAdminMiddle(
    (req, res, next) => { next() },
    ordersM.isOrderOwner,
  ),
  editOrder
);

route.patch('/:orderId',
  ordersM.orderExists, ordersM.validateOrderStatus,
  usersM.isAdminMiddle(
    (req, res, next) => { next() },
    ordersM.canSetOrderStatus
  ),
  editOrderStatus
)

route.get('/:orderId/checkout',
  ordersM.orderExists, ordersM.isOrderOwner,
  checkoutOrder
);

route.get('/checkout/return', ordersM.getCheckoutOrder, checkoutReturn);

route.get('/checkout/cancel', ordersM.getCheckoutOrder, checkoutCancel);

module.exports = route;