const route = require('express').Router();

const {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  editPaymentMethod,
} = require('../controllers/paymentMethod.controller');
const { paymentExist, validateNewPaymentMethod, validateEditPaymentMethod } = require('../middlewares/paymentMethod.middleware');
const { isAuthenticated, isAdmin} = require('../../user/middlewares/users.middleware')

route.use(isAuthenticated);

route.get('/', getPaymentMethods);

// route.get('/:id', authenticate, getPaymentMethod);

route.post('/', isAdmin, validateNewPaymentMethod, addPaymentMethod);

route.patch('/:id', isAdmin, paymentExist, validateEditPaymentMethod, editPaymentMethod)

route.delete('/:id', isAdmin, paymentExist, deletePaymentMethod);

module.exports = route;