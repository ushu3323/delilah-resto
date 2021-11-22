const route = require('express').Router();

const {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  editPaymentMethod,
} = require('../controllers/paymentMethod.controller');
const { paymentExist, validateNewPaymentMethod, validateEditPaymentMethod } = require('../middlewares/paymentMethod.middleware');
const { authenticate, authAdmin} = require('../../user/middlewares/users.middleware')


route.get('/', authenticate, getPaymentMethods);

// route.get('/:id', authenticate, getPaymentMethod);

route.post('/', authAdmin, validateNewPaymentMethod, addPaymentMethod);

route.patch('/:id', authAdmin, paymentExist, validateEditPaymentMethod, editPaymentMethod)

route.delete('/:id', authAdmin, paymentExist, deletePaymentMethod);

module.exports = route;