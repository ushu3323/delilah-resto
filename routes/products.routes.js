const route = require('express').Router();

const userM = require('../middlewares/user.middleware');
const productM = require('../middlewares/product.middleware')
const productC = require('../controllers/product.controller');

const { Products, Users } = require('../models/Data');

// Send the list of products
route.get('/products', userM.idHeaderValidation, productC.listProducts);

// Add a new product
route.post(
    '/products',
    userM.idHeaderValidation, userM.isAdmin, productM.validateNewProduct,
    productC.addNewProduct
);

route.put(
    '/products/:productId',
    userM.idHeaderValidation, userM.isAdmin, productM.idValidation, productM.validateEditProduct,
    productC.editProduct
);

route.patch(
    '/products/:productId',
    userM.idHeaderValidation, userM.isAdmin, productM.idValidation, productM.validateProductEnabled,
    productC.setProductEnabled
);

route.delete(
    '/products/:productId',
    userM.idHeaderValidation, userM.isAdmin, productM.idValidation,
    productC.deleteProduct
);

module.exports = route;