const route = require('express').Router();

const usersM = require('../../user/middlewares/users.middleware');
const ordersM = require('../middlewares/orders.middleware');
const ordersC = require('../controllers/orders.controller');


route.use('/', usersM.authenticate);

route.get('/', ordersC.getOrders); 

route.post('/', ordersM.validateNewOrder, ordersC.addOrder);

route.put('/:orderId',
    ordersM.orderExists,
    ordersM.validateNewOrder,
    usersM.authenticate,
    usersM.isAdminMiddle(
        (req,res,next) => {next()},
        ordersM.canEditOrder,
    ), 
    ordersC.editOrder
);

route.patch('/:orderId',
    ordersM.orderExists,
    usersM.idHeaderValidation, ordersM.orderExists, ordersM.validateOrderStatus,
    usersM.isAdminMiddle(
        (req,res,next) => {next()},
        ordersM.canSetOrderStatus
    ),
    ordersC.editOrderStatus
)

module.exports = route;