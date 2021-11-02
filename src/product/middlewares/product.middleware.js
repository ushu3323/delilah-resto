const { Products } = require("../../models/Data");
const productRepository = require('../repositories/product.repository');


function validateNewProduct(req,res,next) {
    const { name, price } = req.body;

    if (typeof name === "string" && name.length && typeof price === "number") {
        next();
    } else {
        res.status(422).json({error: "Los campos son invalidos"});
    }
}

function idValidation(req, res, next) {
    const productId = parseInt(req.params.productId);
    req.product = productRepository
    if (isNaN(productId)) {
        res.status(422).json({error: "La id del producto es invalida"});
        return;
    }
    if (!Products.get(productId)) {
        res.status(404).json({error: `No se ha encontrado un producto con id ${productId}`});
        return;
    }
    next();
}

function validateEditProduct(req,res,next) {
    const { name, price } = req.body;

    if (typeof name === "string" && name.length && typeof price === "number") {
        next();
    } else {
        res.status(422).json({error: "Los campos son invalidos"});
    }
}

function validateProductEnabled (req, res, next) {
    const { enabled } = req.body;

    if (!(typeof enabled === "boolean")) {
        res.status(422).json({error: "Los campos son invalidos"});
        return;
    }
    next();
}

module.exports = {
    idValidation,
    validateNewProduct,
    validateEditProduct,
    validateProductEnabled
}