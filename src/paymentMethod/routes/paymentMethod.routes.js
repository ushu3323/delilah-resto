const route = require('express').Router();
const {getPaymentMethods, getPaymentMethod, addPaymentMethod, deletePaymentMethod} = require('../controllers/paymentMethod.controller');
const { paymentExist } = require('../middlewares/paymentMethod.middleware');
const { authenticate, authAdmin} = require('../../user/middlewares/users.middleware')


route.get('/', authenticate, getPaymentMethods);

// route.get('/:id', authenticate, getPaymentMethod);

route.post('/', authAdmin, addPaymentMethod);

route.delete('/:id', authAdmin, deletePaymentMethod);

module.exports = route;