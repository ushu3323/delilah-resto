const route = require('express').Router();

const usersM = require('../../user/middlewares/users.middleware');
const ordersM = require('../middlewares/orders.middleware');
const { getOrders, addOrder, editOrder, editOrderStatus } = require('../controllers/orders.controller');

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

module.exports = route;