const route = require('express').Router();

const userM = require('../../user/middlewares/users.middleware');
const productM = require('../middlewares/product.middleware')
const productC = require('../controllers/product.controller');

route.use(userM.isAuthenticated)

// Returns a list of products
route.get('/', productC.getProducts);

// Add a new product
route.post(
    '/',
    userM.isAdmin, productM.validateBody,
    productC.addNewProduct
);

route.put(
    '/:productId',
    userM.isAdmin, productM.idProductExists, productM.validateBody,
    productC.editProduct
);

route.patch(
    '/:productId',
    userM.isAdmin, productM.idProductExists, productM.validateProductEnabled,
    productC.setProductEnabled
);

route.delete(
    '/:productId',
    userM.isAdmin, productM.idProductExists,
    productC.deleteProduct
);

module.exports = route;