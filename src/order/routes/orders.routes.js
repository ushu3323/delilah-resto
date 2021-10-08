const route = require('express').Router();

const usersM = require('../../user/middlewares/user.middleware');
const ordersM = require('../middlewares/orders.middleware');
const ordersC = require('../controllers/orders.controller');


route.use(usersM.idHeaderValidation);

route.get('/orders', ordersC.getOrders); 

route.post(
    '/orders',
    ordersM.validateNewOrder,
    ordersC.addOrder
);

route.put('/orders/:orderId',
    ordersM.orderExists,
    ordersM.validateNewOrder,
    usersM.isAdminMiddle(
        (req,res,next) => {next()},
        ordersM.canEditOrder,
    ), 
    ordersC.editOrder
);

route.patch('/orders/:orderId',
    ordersM.orderExists,
    usersM.idHeaderValidation, ordersM.orderExists, ordersM.validateOrderStatus,
    usersM.isAdminMiddle(
        (req,res,next) => {next()},
        ordersM.canSetOrderStatus
    ),
    ordersC.editOrderStatus
)

module.exports = route;