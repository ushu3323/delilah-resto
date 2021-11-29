const route = require('express').Router();

const userM = require('../../user/middlewares/users.middleware');
const productM = require('../middlewares/product.middleware')
const productC = require('../controllers/product.controller');

// Returns a list of products
route.get('/', userM.authenticate, productC.getProducts);

// Add a new product
route.post(
    '/',
    userM.authAdmin, productM.validateBody,
    productC.addNewProduct
);

route.put(
    '/:productId',
    userM.authAdmin, productM.idProductExists, productM.validateBody,
    productC.editProduct
);

route.patch(
    '/:productId',
    userM.authAdmin, productM.idProductExists, productM.validateProductEnabled,
    productC.setProductEnabled
);

route.delete(
    '/:productId',
    userM.authAdmin, productM.idProductExists,
    productC.deleteProduct
);

module.exports = route;