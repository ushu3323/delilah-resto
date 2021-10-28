const route = require('express').Router();

const userM = require('../../user/middlewares/users.middleware');
const productM = require('../middlewares/product.middleware')
const productC = require('../controllers/product.controller');

// Returns a list of products
route.get('/', userM.authenticate, productC.getProducts);

// Add a new product
route.post(
    '/',
    userM.authenticate, userM.isAdmin, productM.validateNewProduct,
    productC.addNewProduct
);

route.put(
    '/:productId',
    userM.authenticate, userM.isAdmin, productM.idValidation, productM.validateEditProduct,
    productC.editProduct
);

route.patch(
    '/:productId',
    userM.authenticate, userM.isAdmin, productM.idValidation, productM.validateProductEnabled,
    productC.setProductEnabled
);

route.delete(
    '/:productId',
    userM.authenticate, userM.isAdmin, productM.idValidation,
    productC.deleteProduct
);

module.exports = route;